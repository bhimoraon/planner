import TabSwitcher from "../../components/TabSwitcher";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


async function page() {
	const user = await getUser();
	if (user) {
		return redirect("/");
	}

	const token = (await cookies()).get("userInfo")?.value || null;
	let tokenData;
	if (token) {
		try {
			tokenData = await jwt.verify(token, process.env.TOKEN_SECRET!);

		} catch (error) {
			console.log("JWT verification failed:", error);
		}
	} else {
		console.log("No token exist ");
	}


	return (
		<div className=" h-screen w-full flex  relative  ">
			<div className=" max-w-3xl  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="size-4"></div>

				<TabSwitcher SignUpTab={<SignUpForm />} SignInTab={<SignInForm />} />
			</div>
		</div>
	);
}

export default page;
