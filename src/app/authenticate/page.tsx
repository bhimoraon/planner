import TabSwitcher from "../../components/tab-switcher";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";


async function page() {
	const user = await getUser();
	if (user) {
		return redirect("/");
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
