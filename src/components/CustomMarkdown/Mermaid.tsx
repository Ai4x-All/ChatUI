// MermaidRenderer.jsx
import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import React from "react";


const MermaidRenderer = ({ chart, theme }:any) => {
    const ref:any = useRef(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        let timeout:any = null;

        // 只初始化一次，除非 theme 发生变化
        if (!isInitializedRef.current || theme) {
            mermaid.initialize({
                startOnLoad: false,
                theme: theme || "default",
                securityLevel: "loose",
                htmlLabels: true,
            });
            isInitializedRef.current = true;
        }

        if (isMounted && ref.current && chart) {
            timeout = setTimeout(() => {
                try {
                    mermaid.run({ nodes: [ref.current] });
                } catch (error) {
                    console.error("Failed to render Mermaid chart:", error);
                }
            }, 0);
        }

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [chart, theme]);

    // 防止空内容渲染非法 HTML
    if (!chart || typeof chart !== "string") {
        return <div style={{ padding: "1rem" }}>No valid Mermaid chart content provided.</div>;
    }

    return (
      <div
        ref={ref}
        className="mermaid"
        style={{ width: "100%", overflowX: "auto" }}
        dangerouslySetInnerHTML={{ __html: chart }}
      />
    );
};

export default MermaidRenderer;
