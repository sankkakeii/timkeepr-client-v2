import globalConfig from '@/globalConfig';
import SEO from '@/components/Modular/SEO';
import AuthLayout from '@/components/Modular/auth/layout';
import ForgotPasswordForm from '@/components/Modular/auth/ForgotPassword';

const ForgotPassword = () => {
    return (
        <>
            <SEO
                title="Forgot password"
                description="Reset your password here"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <AuthLayout
                    title="Forgot Password"
                    description="Reset your password" >

                    <ForgotPasswordForm />
                </AuthLayout>
            </div>
        </>
    );
};

export default ForgotPassword;



