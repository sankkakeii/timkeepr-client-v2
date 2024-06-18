import globalConfig from '@/globalConfig';
import SEO from '@/components/Modular/SEO';
import { SignUp } from '@/components/Modular/auth/SignupForm';
import AuthLayout from '@/components/Modular/auth/layout';

const SignUpForm = () => {
    return (
        <>
            <SEO
                title="Signup"
                description="Signup page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <AuthLayout
                    title="Sign Up"
                    description="Create your account" >
                    <SignUp
                        signUpOptions={{
                            google: globalConfig.auth.providers.google,
                            facebook: globalConfig.auth.providers.facebook,
                            github: globalConfig.auth.providers.github
                        }}
                    />
                </AuthLayout>
            </div>
        </>
    );
};

export default SignUpForm;



