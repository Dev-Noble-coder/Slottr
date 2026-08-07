import { useState } from 'react'
import AuthLayout from '../components/layouts/AuthLayout'
import ResetPasswordIllustration from '../assets/auth/svg_reset_password.svg'
import AuthForm from '../components/ui/AuthForm'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);

    return (
        <AuthLayout illustration={ResetPasswordIllustration}>
            <AuthForm>
                <div className='flex flex-col gap-6 w-full'>
                    <div className='text-blue mb-4'>
                        <h2 className='font-semibold text-3xl'>Reset Password</h2>
                        <p className='text-[15px] mt-1 font-medium'>Create a new password for your account</p>
                    </div>

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="*****************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="*****************"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasMinLength ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasMinLength ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain a minimum of 8 characters
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasNumber ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasNumber ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain at least one number
                            </span>
                        </div>
                    </div>
                </div>

                <div className='mt-8'>
                    <button
                        className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setModalOpen(true)}
                        disabled={!hasMinLength || !hasNumber || password !== confirmPassword || password === ''}
                    >
                        Reset Password
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
                    buttonInfo="Login"
                    onClose={() => setModalOpen(false)}
                />
            </AuthForm>
        </AuthLayout>
    )
}

export default ResetPassword