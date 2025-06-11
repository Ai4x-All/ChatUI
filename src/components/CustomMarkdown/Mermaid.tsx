// MermaidRenderer.jsx
import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import React from "react";


const MermaidRenderer = ({ chart, theme }:any) => {
    const ref = useRef(null);

    useEffect(() => {
        // 每次 theme 改变时重新初始化 Mermaid
        mermaid.initialize({
            startOnLoad: false,
            theme: theme || "default",
            securityLevel: "loose",
        });

        if (ref.current) {
            mermaid.run({ nodes: [ref.current] });
        }
    }, [chart, theme]);

    return (
        <div
            ref={ref}
            className="mermaid"
            style={{width: '100%', overflowX: 'auto'}}
            dangerouslySetInnerHTML={{ __html: chart }}
        />
    );
};

export default MermaidRenderer;
