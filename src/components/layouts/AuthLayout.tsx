
type AuthLayoutProps = {
    illustration: string;
    children: React.ReactNode;
};

const AuthLayout = ({ illustration, children }: AuthLayoutProps) => {
    return (
        <div className='flex h-screen bg-white overflow-hidden relative'>
            {/* Background patch to fill the gap behind the bottom-left rounded corner of the right container */}
            <div className='hidden lg:block absolute bottom-0 left-1/2 w-32 h-32 bg-accent/95 z-0'></div>

            <div className='hidden lg:flex flex-1 justify-center items-center bg-gradient-to-b from-gray-light to-accent rounded-tr-[100px] relative z-10'>
                <img src={illustration} alt="Authentication" className="w-[500px] h-[403px] object-cover" />
            </div>
            
            <div className='flex-1 flex flex-col bg-white lg:rounded-bl-[100px] relative z-10 overflow-y-auto'>
                <div className='w-full min-h-full flex flex-col justify-center p-6 sm:p-8 lg:p-12'>
                    {children}
                </div>
            </div>
        </div>   
    ) 
}

export default AuthLayout