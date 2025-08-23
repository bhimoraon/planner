'use client'
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Play,
  History,
  Star,
  Settings,
  BookOpen,
  FileText,
  User,
  Palette,
  TrendingUp,
  Plane,
  MoreHorizontal,
  ChevronUp,
  Target,
  Globe,
  Code,
  Megaphone,
  ShoppingCart,
  Smartphone,
  Monitor,
  Shield,
  CheckCircle,
  Circle,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logout } from "@/app/authenticate/auth.action"
import router from "next/router"

const platformItems = [
  {
    title: "Goals",
    icon: Play,
    isCollapsible: true,
    items: [
      { title: "History", icon: History },
      { title: "Starred", icon: Star },
      { title: "Settings", icon: Settings },
    ],
  },
  {
    title: "Domains",
    icon: FileText,
    hasSubmenu: true,
  },
  {
    title: "Projects",
    icon: BookOpen,
    hasSubmenu: true,
  },
  {
    title: "Tasks",
    icon: Settings,
    hasSubmenu: true,
  },
]

const projectItems = [
  {
    title: "Design Engineering",
    icon: Palette,
    hasAction: true,
  },
  {
    title: "Sales & Marketing",
    icon: TrendingUp,
  },
  {
    title: "Travel",
    icon: Plane,
  },
  {
    title: "More",
    icon: MoreHorizontal,
  },
]

const hierarchyData = [
  {
    title: "Business Growth",
    icon: Target,
    type: "goal",
    domains: [
      {
        title: "Marketing",
        icon: Megaphone,
        type: "domain",
        projects: [
          {
            title: "Website Redesign",
            icon: Monitor,
            type: "project",
            tasks: [
              { title: "Design Homepage", icon: Circle, completed: false },
              { title: "Implement Auth", icon: CheckCircle, completed: true },
              { title: "Add Analytics", icon: Circle, completed: false },
            ],
          },
          {
            title: "SEO Optimization",
            icon: Globe,
            type: "project",
            tasks: [
              { title: "Keyword Research", icon: CheckCircle, completed: true },
              { title: "Content Updates", icon: Circle, completed: false },
            ],
          },
        ],
      },
      {
        title: "Sales",
        icon: ShoppingCart,
        type: "domain",
        projects: [
          {
            title: "CRM Integration",
            icon: FileText,
            type: "project",
            tasks: [
              { title: "Setup Database", icon: Circle, completed: false },
              { title: "Import Contacts", icon: Circle, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Product Development",
    icon: Code,
    type: "goal",
    domains: [
      {
        title: "Engineering",
        icon: Code,
        type: "domain",
        projects: [
          {
            title: "Mobile App",
            icon: Smartphone,
            type: "project",
            tasks: [
              { title: "Setup React Native", icon: CheckCircle, completed: true },
              { title: "Build Login Screen", icon: Circle, completed: false },
              { title: "Add Push Notifications", icon: Circle, completed: false },
            ],
          },
          {
            title: "Security Audit",
            icon: Shield,
            type: "project",
            tasks: [
              { title: "Vulnerability Scan", icon: Circle, completed: false },
              { title: "Update Dependencies", icon: Circle, completed: false },
            ],
          },
        ],
      },
    ],
  },
]

export function AppSidebar() {
   const pathname = usePathname();
   const isAuthRoute = pathname.startsWith("/authenticate");
   
   if (isAuthRoute) {
       return null; // Don't render sidebar on auth routes
   }
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">Enterprise</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Building2 className="mr-2 size-4" />
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Building2 className="mr-2 size-4" />
                  <span>Acme Corp</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isCollapsible ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href="#">
                                  <subItem.icon className="size-4" />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.hasSubmenu && <ChevronRight className="ml-auto size-4" />}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Goals & Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hierarchyData.map((goal) => (
                <SidebarMenuItem key={goal.title}>
                  <Collapsible className="group/goal">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={goal.title} className="font-medium">
                        <goal.icon className="size-4" />
                        <span>{goal.title}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/goal:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {goal.domains.map((domain) => (
                          <SidebarMenuSubItem key={domain.title}>
                            <Collapsible className="group/domain">
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton className="font-medium">
                                  <domain.icon className="size-4" />
                                  <span>{domain.title}</span>
                                  <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/domain:rotate-90" />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub className="ml-4">
                                  {domain.projects.map((project) => (
                                    <SidebarMenuSubItem key={project.title}>
                                      <Collapsible className="group/project">
                                        <CollapsibleTrigger asChild>
                                          <SidebarMenuSubButton>
                                            <project.icon className="size-4" />
                                            <span>{project.title}</span>
                                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/project:rotate-90" />
                                          </SidebarMenuSubButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <SidebarMenuSub className="ml-4">
                                            {project.tasks.map((task) => (
                                              <SidebarMenuSubItem key={task.title}>
                                                <SidebarMenuSubButton className="text-sm">
                                                  <task.icon
                                                    className={`size-4 ${task.completed ? "text-green-500" : "text-muted-foreground"}`}
                                                  />
                                                  <span
                                                    className={
                                                      task.completed ? "line-through text-muted-foreground" : ""
                                                    }
                                                  >
                                                    {task.title}
                                                  </span>
                                                </SidebarMenuSubButton>
                                              </SidebarMenuSubItem>
                                            ))}
                                          </SidebarMenuSub>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.hasAction && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 rounded-lg" side="bottom" align="end">
                        <DropdownMenuItem>
                          <span>Edit Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>Archive</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/diverse-user-avatars.png" alt="shadcn" />
                    <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">shadcn</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">m@example.com</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-red-500 hover:text-red-500" onClick={async () => {
						await logout();
						router.push("/authenticate");
					}}>
                  <User className="mr-2 size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 size-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
