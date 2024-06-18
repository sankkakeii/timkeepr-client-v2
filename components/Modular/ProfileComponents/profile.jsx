import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { UserLogic } from '@/lib/business_logic/user_logic/user-logic';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';

export function UpdateUserProfile() {
    const { updateUserProfile, uploadImageToFirebase, authUser } = UserLogic();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            firstName: authUser?.data?.firstName,
            lastName: authUser?.data?.lastName,
            profileImage: authUser?.data?.profileImage,
        },
    });


    const handleFileChange = (event) => {
        const input = event.target;
        const file = input.files[0];

        if (file) {
            const output = document.getElementById('preview_img');

            // Set the src attribute directly for the AvatarImage
            output?.querySelector('.avatar-image')?.setAttribute('src', URL.createObjectURL(file));

            form.setValue('profileImage', file);
        }
    };


    const handleSubmit = form.handleSubmit(async (values) => {
        setLoading(true);

        try {
            let imageUrl = values.profileImage;
            let name = `${values.firstName + ' ' + values.lastName}`;

            const updatedValues = Object.fromEntries(
                Object.entries(values).filter(([key, value]) => value !== '' && value !== null)
            );

            if (updatedValues.profileImage instanceof File) {
                imageUrl = await uploadImageToFirebase(updatedValues.profileImage);
            }

            const result = await updateUserProfile(authUser.uid, {
                ...updatedValues,
                profileImage: imageUrl,
                name: name
            });

            toast({
                title: result.status.charAt(0).toUpperCase() + result.status.slice(1),
                description: result.message,
            });

        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'An error occurred while updating profile.',
            });
        } finally {
            setLoading(false);
        }
    });



    return (
        <>
            <div className="border rounded-md p-6 lg:w-1/4 md:w-1/2 w-full">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-5"
                    >
                        <div className="space-y-3 text-left">
                            <FormField
                                control={form.control}
                                name="profileImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Image</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-5 items-center">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage
                                                        id="preview_img"
                                                        src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value || '/avatars/01.png'}
                                                        alt="user profile image"
                                                    />
                                                    <AvatarFallback>NS</AvatarFallback>
                                                </Avatar>

                                                <label className="cursor-pointer p-2 rounded-md bg-primary bg-green-600 text-white hover:bg-green-500">
                                                    <span className="text-base leading-normal">
                                                        Select Profile Photo
                                                    </span>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your first name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your last name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="w-full" type="submit">
                            Update Profile
                        </Button>
                        {loading && <Spinner />}
                    </form>
                </Form>
            </div>
        </>
    );
}
