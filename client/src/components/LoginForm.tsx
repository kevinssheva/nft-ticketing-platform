"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { pinata } from "@/lib/pinata";

const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Please enter a longer username.",
    })
    .nonempty({ message: "Please enter a username." }),
  fullName: z.string().nonempty({
    message: "Please enter your full name.",
  }),
  idCard: z.instanceof(File).refine((file) => file?.size > 0, {
    message: "Please upload your ID card.",
  }),
});

const Register = () => {
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    console.log("Form Values:", values);
    console.log("Uploaded ID Card:", values.idCard.name);

    try {
      const upload = await pinata.upload.file(values.idCard);
      console.log(upload);

      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
      console.log(ipfsUrl);
      // const formData = new FormData();
      // formData.append("file", idCardFile);
      // const metadata = JSON.stringify({
      //   name: idCardFile.name,
      //   keyvalues: {
      //     username: values.username,
      //     fullName: values.fullName,
      //   },
      // });
      // formData.append("pinataMetadata", metadata);
      // const options = JSON.stringify({
      //   cidVersion: 1,
      // });
      // formData.append("pinataOptions", options);
      // const response = await pinata.pinFileToIPFS(formData);
      // console.log("Pinata Response:", response);
      // alert(`File uploaded successfully! CID: ${response.data.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      alert("Failed to upload file. Please try again.");
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <h2 className="font-bold text-xl text-center mb-4">Register</h2>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="kevinsheva123" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your preferred username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Kevin Anggara" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your full government name as on your ID card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">ID Card</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a clear image of your ID card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Register;
