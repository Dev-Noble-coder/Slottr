import { useState } from 'react'
import AuthLayout from '../components/layouts/AuthLayout'
import ForgotPasswordIllustration from '../assets/auth/svg_forgot_password.svg'
import AuthForm from '../components/ui/AuthForm'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'

const ForgotPassword = () => {

    const [modalOpen, setModalOpen] = useState(false)


    return (
        <AuthLayout illustration={ForgotPasswordIllustration}>
            <AuthForm>
                <div className='flex flex-col gap-10 w-full'>
                    <div className='text-blue'>
                        <h2 className='font-semibold text-3xl'>Forgot Password</h2>
                        <p className='text-[15px]  mt-1 font-medium'>Enter your registered email address to reset</p>
                    </div>


                    <Input label="Email Address" type="email" placeholder="[EMAIL_ADDRESS]" />

                </div>
                <div className='mt-5'>
                    <button className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setModalOpen(true)}>
                        Continue
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>

                <Modal
                    type="success"
                    title="Successful!"
                    message="Your password has been reset successfully. You can now login with your new password."
                    open={modalOpen}
                    buttonInfo="Continue"
                    onClose={() => setModalOpen(false)}
                />
            </AuthForm>
        </AuthLayout>
    )
}

export default ForgotPassword