import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useCheckTokenValidity, useAcceptInvitation } from "../hooks/useAuth"
import { toast } from "sonner"
import AuthLayout from "../components/layouts/AuthLayout"
import ResetPasswordIllustration from '../assets/auth/svg_reset_password.svg'
import AuthForm from "../components/ui/AuthForm"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"

const AcceptInvitation = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")

    const { data: tokenData, isError: tokenError } = useCheckTokenValidity(token);
    const { mutateAsync: acceptInvitation, isPending: isLoading } = useAcceptInvitation();

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()]/.test(password);

    useEffect(() => {
        if (tokenData) {
            if (tokenData.status === "invalid") {
                toast.error("Token is invalid.")
                navigate("/");
            } else {
                toast.success("Token is valid.")
            }
        }
        if (tokenError) {
            toast.error("Failed to validate token.")
            navigate("/");
        }
    }, [tokenData, tokenError, navigate]);


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const res = await acceptInvitation({ password, token, confirmPassword });

            if (res.status == 200) {
                setModalOpen(true)
                // reset fields
                setPassword('')
                setConfirmPassword('')

                // redirect to login
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                toast.error("Failed to create password.")
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.")
        }
    }

    return (
        <AuthLayout illustration={ResetPasswordIllustration}>
            <AuthForm>
                <div className='flex flex-col gap-6 w-full'>
                    <div className='text-blue mb-4'>
                        <h2 className='font-semibold text-3xl'>Create Password</h2>
                        <p className='text-[15px] mt-1 font-medium'>Create a secure password for your account</p>
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
                        <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full ${hasSpecialCharacter ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                            <span className={`text-[14px] ${hasSpecialCharacter ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                                Must contain at least one special character (!@#$%^&*())
                            </span>
                        </div>
                    </div>
                </div>

                <div className='mt-8'>
                    <button
                        className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isLoading || !hasMinLength || !hasNumber || !hasSpecialCharacter || password !== confirmPassword || password === ''}
                    >
                        {isLoading ? (
                            <>
                                Creating...
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </>
                        ) : (
                            <>
                                Create Password
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </>
                        )}
                    </button>
                </div>

                <Modal
                    type="success"
                    title="Successful!"
                    message="Your password has been set successfully. You can now login with your password."
                    open={modalOpen}
                    buttonInfo="Login"
                    onClose={() => setModalOpen(false)}
                />
            </AuthForm>
        </AuthLayout>
    )
}

export default AcceptInvitation