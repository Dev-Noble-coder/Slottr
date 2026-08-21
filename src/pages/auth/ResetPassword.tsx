import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import ForgotPasswordIllustration from '../../assets/auth/svg_forgot_password.svg'
import AuthForm from '../../components/ui/AuthForm'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { useResetPassword } from '../../hooks/useAuth'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const emailParam = searchParams.get('email') || ''
    
    const [email, setEmail] = useState(emailParam)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const { mutateAsync: resetPassword, isPending } = useResetPassword()
    const navigate = useNavigate()

    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialCharacter = /[!@#$%^&*()]/.test(newPassword);

    const isValidPassword = hasMinLength && hasUppercase && hasNumber && hasSpecialCharacter;
    const passwordsMatch = newPassword === confirmPassword;

    const handleResetPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setError('')

        if (!email || !code || !newPassword || !confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (!isValidPassword) {
            setError('Password does not meet requirements')
            return
        }

        if (!passwordsMatch) {
            setError('Passwords do not match')
            return
        }

        try {
            await resetPassword({ email, code, newPassword, confirmPassword })
            setModalOpen(true)
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to reset password. Please check your OTP and try again.')
        }
    }

    const handleModalClose = () => {
        setModalOpen(false)
        navigate('/login')
    }

    return (
        <AuthLayout illustration={ForgotPasswordIllustration}>
            <AuthForm>
                <div className='flex flex-col gap-6 w-full'>
                    <div className='text-blue mb-2'>
                        <h2 className='font-semibold text-3xl'>Verify & Reset</h2>
                        <p className='text-[15px] mt-1 font-medium'>Enter the OTP sent to your email and your new password.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Input 
                            label="Email Address" 
                            type="email" 
                            placeholder="johndoe@gmail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!!emailParam} // Disable if passed via query param
                            error={error && !email ? 'Email is required' : ''}
                        />
                        
                        <Input 
                            label="OTP Code" 
                            type="text" 
                            placeholder="e.g. 123456" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            error={error && !code ? 'OTP Code is required' : ''}
                        />
                        
                        <Input 
                            label="New Password" 
                            type="password" 
                            placeholder="*****************" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            error={error && !newPassword ? 'New Password is required' : ''}
                        />
                        
                        <Input 
                            label="Confirm Password" 
                            type="password" 
                            placeholder="*****************" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={error && !confirmPassword ? 'Confirm Password is required' : ''}
                        />
                    </div>

                    {/* Password Requirements */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasMinLength ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasMinLength ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain a minimum of 8 characters
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasUppercase ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasUppercase ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain at least one uppercase letter
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasNumber ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasNumber ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain at least one number
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasSpecialCharacter ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasSpecialCharacter ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain at least one special character (!@#$%^&*())
                            </span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                </div>

                <div className='mt-6'>
                    <button 
                        onClick={handleResetPassword}
                        disabled={isPending || !email || !code || !isValidPassword || !passwordsMatch}
                        className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                Resetting...
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </>
                        ) : (
                            <>
                                Reset Password
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </>
                        )}
                    </button>
                    
                    <div className="mt-8">
                        <p className="text-[15px] text-slate-500">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-blue hover:underline font-medium transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                <Modal
                    type="success"
                    title="Successful!"
                    message="Your password has been reset successfully. You can now login with your new password."
                    open={modalOpen}
                    buttonInfo="Go to Login"
                    onClose={handleModalClose}
                />
            </AuthForm>
        </AuthLayout>
    )
}

export default ResetPassword