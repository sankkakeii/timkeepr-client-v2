// import globalConfig from '@/globalConfig';
// import SEO from '@/components/Modular/SEO';
// import { SignIn } from '@/components/Modular/auth/SignInForm';
// import AuthLayout from '@/components/Modular/auth/layout';

// const LoginForm = () => {
//     return (
//         <>
//             <SEO
//                 title="Login"
//                 description="Login page"
//                 canonical={globalConfig.site.siteUrl}
//                 openGraph={{
//                     url: `${globalConfig.site.siteUrl}/`,
//                 }}
//             />
//             <div>
//                 <AuthLayout
//                     title="Sign In"
//                     description="Sign in to your account" >
//                     <SignIn
//                         signUpOptions={{
//                             google: globalConfig.auth.providers.google,
//                             facebook: globalConfig.auth.providers.facebook,
//                             github: globalConfig.auth.providers.github
//                         }} />
//                 </AuthLayout>
//             </div>
//         </>
//     );
// };

// export default LoginForm;









import globalConfig from '@/globalConfig';
import SEO from '@/components/Modular/SEO';
import SignIn from '@/components/Modular/auth/SignInForm';
// import AuthLayout from '@/components/Modular/auth/layout';

const LoginForm = () => {
    return (
        <>
            <SEO
                title="Login"
                description="Login page"
                canonical={globalConfig.site.siteUrl}
                openGraph={{
                    url: `${globalConfig.site.siteUrl}/`,
                }}
            />
            <div>
                <SignIn />
            </div>
        </>
    );
};

export default LoginForm;
