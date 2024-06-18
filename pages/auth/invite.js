
import globalConfig from '@/globalConfig';
import SEO from '@/components/Modular/SEO';
import AuthLayout from '@/components/Modular/auth/layout';
import InviteSignUpForm from '@/components/Modular/auth/inviteForm';

const ForgotPassword = () => {
    return (
        <>
            <SEO
                title="Join our Organization"
                description="User invite to join organization"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <AuthLayout
                    title="Join Organization"
                    description="Sign up to join our organization" >

                    <InviteSignUpForm />
                </AuthLayout>
            </div>
        </>
    );
};

export default ForgotPassword;



