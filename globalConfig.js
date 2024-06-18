module.exports = {
    site: {
        title: 'Timekeepr',
        description: '',
        siteUrl: 'http://localhost:5075',
        emailVerificationURL: 'http://localhost:5075/_admin/settings',
        siteName: '',
        language: 'en',
        // this is the email nodemailer uses to send emails
        supportEmail: 'testyacnt@gmail.com',
        logo: '/vercel.svg',
        version: '1.0.0'
    },

    socials: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        tiktok: '',
        email: ''
    },

    // add your Firebase collections here modify as you see fit
    firestoreCollections: {
        users: 'usersProfile',
        organizations: 'organizations',
        teams: 'teams',
        pendingUsers: 'pendingUsers',
        invitesHistory: 'invitesHistory',
    },

    // link expiration duration
    // If the date is less than 5 days, proceed with user creation
    linkExpiration: {
        duration: 5
    },

    roles: {
        superuser: 'superuser',
        admin: 'admin',
        user: 'user',
    },


    auth: {
        // Enable MFA. You must upgrade to the GoogleCloud Identity Platform to use it.
        enableMultiFactorAuth: false,

        //Enable the providers below in the Firebase Console in your production project
        providers: {
            phoneNumber: false,
            emailLink: false,
            google: true,
            facebook: true,
            github: false,
        },
    },
};




