import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

interface RichTextEditorProps {
    html: string;
    setHtml: React.Dispatch<React.SetStateAction<string>>;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ html, setHtml }) => {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    // 模拟 ajax 请求，异步设置 html
    useEffect(() => {
        setHtml(html || '');
    }, [html]);

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: ['fontFamily', 'uploadVideo', 'todo'],
    };

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        MENU_CONF: {
            uploadImage: {
                // 上传图片配置
                server: '/api/v1/upload',
                fieldName: 'file',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                onBeforeUpload(filesMap: { [key: string]: File }) {
                    if (!filesMap) return;
                    let files = Object.values(filesMap);
                    if (files.length > 0) {
                        const isLt4M = files[0].size / 1024 / 1024 < 4;
                        if (!isLt4M) {
                            message.error('图片大小不能超过 4MB!');
                            return false;
                        }
                        return filesMap;
                    }
                },
                // eslint-disable-next-line no-unused-vars
                customInsert(result: { data: { url: string } }, insertImgFn: (url: string) => void) {
                    insertImgFn(result.data.url);
                },
            },
        },
    };

    // 及时销毁 editor ，重要！
    useEffect(() => {
        console.log('[RichTextEditor.tsx:] ', editor?.getMenuConfig('uploadImage'));
        console.log('[RichTextEditor.tsx:] ', editor?.getConfig());
        // console.log('[RichTextEditor.tsx:] ', editor?.getAllMenuKeys());

        return () => {
            if (editor === null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100, width: '40rem' }}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />

                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={(editor: { getHtml: () => React.SetStateAction<string> }) => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
        </>
    );
};

export default RichTextEditor;
