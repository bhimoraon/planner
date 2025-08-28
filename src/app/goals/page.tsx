import { getGoals } from "@/lib/actions"
import { GoalsClient } from "./GoalsClient"

export default async function GoalsPage() {
  const result = await getGoals()
  const goals = result.success ? result.data : []

  return <GoalsClient initialGoals={goals??[]} />
}
