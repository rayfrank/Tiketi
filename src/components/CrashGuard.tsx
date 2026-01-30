import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: unknown };

export default class CrashGuard extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: unknown) {
        return { hasError: true, error };
    }

    componentDidCatch(error: unknown) {
        // Also logs to console
        console.error("CrashGuard caught:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 18, fontFamily: "system-ui" }}>
                    <h1 style={{ fontSize: 20, fontWeight: 800 }}>Tiketi crashed ❌</h1>
                    <p style={{ opacity: 0.8 }}>
                        There is a runtime error in your code. Copy the message below and paste it to me.
                    </p>
                    <pre
                        style={{
                            marginTop: 12,
                            background: "#111827",
                            color: "#fff",
                            padding: 12,
                            borderRadius: 12,
                            overflow: "auto",
                            maxWidth: 900,
                        }}
                    >
                        {String(this.state.error)}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}
