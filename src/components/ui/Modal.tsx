type ModalProps = {
    type: "success" | "error" | "info"
    title: string
    message: string
    open: boolean
    buttonInfo: string
    onClose: () => void

};

const Modal = ({ type, title, message, open, buttonInfo, onClose }: ModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-[480px] w-[92%] text-center shadow-2xl relative">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8">
                    {type === "success" && (
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M60 30C60 46.5684 46.5684 60 30 60C13.4314 60 0 46.5684 0 30C0 13.4314 13.4314 0 30 0C46.5684 0 60 13.4314 60 30ZM42.0909 20.909C42.9696 21.7877 42.9696 23.2123 42.0909 24.0909L27.0909 39.0909C26.2122 39.9696 24.7878 39.9696 23.909 39.0909L17.909 33.0909C17.0303 32.2122 17.0303 30.7878 17.909 29.9091C18.7877 29.0304 20.2123 29.0304 21.091 29.9091L25.5 34.3179L32.2044 27.6135L38.9091 20.909C39.7878 20.0303 41.2122 20.0303 42.0909 20.909Z" fill="var(--color-success)" />
                        </svg>
                    )}
                    {type === "error" && (
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M60 30C60 46.5684 46.5684 60 30 60C13.4314 60 0 46.5684 0 30C0 13.4314 13.4314 0 30 0C46.5684 0 60 13.4314 60 30ZM20.9089 20.909C21.7876 20.0303 23.2122 20.0303 24.0909 20.909L30 26.8179L35.9088 20.909C36.7875 20.0303 38.2122 20.0303 39.0909 20.909C39.9696 21.7877 39.9696 23.2123 39.0909 24.0909L33.1818 30L39.0909 35.9088C39.9696 36.7875 39.9696 38.2122 39.0909 39.0909C38.2122 39.9696 36.7875 39.9696 35.9088 39.0909L30 33.1821L24.0909 39.0909C23.2123 39.9696 21.7876 39.9696 20.909 39.0909C20.0303 38.2122 20.0303 36.7875 20.909 35.9091L26.8179 30L20.9089 24.0909C20.0302 23.2123 20.0302 21.7876 20.9089 20.909Z" fill="var(--color-error)" />
                        </svg>
                    )}
                    {type === "info" && (
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60ZM30 14C28.3431 14 27 15.3431 27 17C27 18.6569 28.3431 20 30 20C31.6569 20 33 18.6569 33 17C33 15.3431 31.6569 14 30 14ZM33 26H27V46H33V26Z" fill="#3B82F6" />
                        </svg>
                    )}
                </div>
                <h2 className="text-3xl font-medium text-blue mb-5 tracking-tight">{title}</h2>
                <p className="text-blue text-lg leading-relaxed mb-8 px-4 ">{message}</p>
                <button 
                    onClick={onClose}
                    className="bg-button-dark text-white px-10 py-3.5 rounded-full text-base font-medium hover:bg-button-dark-hover transition-colors shadow-sm cursor-pointer"
                >
                    {buttonInfo}
                </button>
            </div>
        </div>
    )
}

export default Modal