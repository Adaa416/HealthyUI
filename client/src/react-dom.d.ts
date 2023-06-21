import { RootOptions, Work } from 'react-dom';

declare module 'react-dom' {
    function createRoot(
        container: Element,
        options?: RootOptions,
    ): {
        render: (children: React.ReactNode) => Work,
        unmount: () => Work,
    };
}
