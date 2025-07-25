import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {tomorrow} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import 'katex/dist/katex.min.css'
import {lazy} from "react"; // `rehype-katex` does not import the CSS for you
import React from "react";

const Mermaid = lazy(() => import('./Mermaid'));

export const CustomMarkdown: React.FC<any> = (props: any) => {
    const {content, handleDetail, theme} = props

    const CustomLink = ({href, children, ...other}: any) => {
        const handleClick = (event: any) => {
            event.preventDefault(); // 阻止默认跳转行为
            if (handleDetail) {
                console.log('Link clicked:', href); // 打印链接地址
                handleDetail(href, 'link')
            } else {
                window.open(href, '_blank'); // 示例：在新窗口中打开链接
            }
        };

        return (
            <a href={href} onClick={handleClick} {...other}>
                {children}
            </a>
        );
    };
    const CustomImg = ({src, children, ...other}: any) => {
        return (
            <img style={{maxWidth: '30%'}} src={src} alt="" {...other}/>
        );
    };
    return <ReactMarkdown
        className="messageContent"
        components={{
            a: CustomLink, // 替换默认的 <a> 渲染器
            img: CustomImg,
            code({node, inline, className, children, ...other}:any) {
                const match = /language-(\w+)/.exec(className || '')
                const code = String(children).trim();

                if (match?.[1] === 'mermaid') {
                    return <Mermaid chart={code} theme={theme} />;
                }

                return !inline && match ? (
                    <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...other}>
                        {code}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...other}>
                        {children}
                    </code>
                );
            }
        }}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[/*rehypeRaw,*/ rehypeKatex]}
        skipHtml={false}
    >
        {content}
    </ReactMarkdown>
}
