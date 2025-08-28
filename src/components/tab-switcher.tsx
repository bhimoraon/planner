"use client";

/// tsrfce
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Props = { SignUpTab: React.ReactNode; SignInTab: React.ReactNode };

function TabSwitcher(props: Props) {
	return (
		<Tabs className=" min-w-[330px]  " defaultValue="sign-in">
			<TabsList className="flex justify-center items-center ">
				<TabsTrigger value={"sign-up"}>Sign Up</TabsTrigger>
				<TabsTrigger value={"sign-in"}>Sign In</TabsTrigger>
			</TabsList>
			<TabsContent value="sign-up">{props.SignUpTab}</TabsContent>
			<TabsContent value="sign-in">{props.SignInTab}</TabsContent>
		</Tabs>
	);
}

export default TabSwitcher;
