"use client"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronRight,
  Building2,
  Home,
  Target,
  Globe,
  FolderOpen,
  CheckSquare,
  Settings,
  User,
  ChevronUp,
  LogOut,
  Bell,
  Search,
  Plus,
  BarChart3,
  Calendar,
  Clock,
  Star,
  Archive,
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
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { logout } from "@/app/authenticate/actions"

const mainNavItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
    badge: null,
  },
  // {
  //   title: "Workspace",
  //   icon: Calendar,
  //   url: "/workspace",
  //   badge: "5",
  // },
  {
    title: "Goals",
    icon: Target,
    url: "/goals",
    badge: "3",
  },
  // {
  //   title: "Domains",
  //   icon: Globe,
  //   url: "/domains",
  //   badge: null,
  // },
  // {
  //   title: "Projects",
  //   icon: FolderOpen,
  //   url: "/projects",
  //   badge: "12",
  // },
  {
    title: "Tasks",
    icon: CheckSquare,
    url: "/tasks",
    badge: "9",
  },

  // {
  //   title: "Analytics",
  //   icon: BarChart3,
  //   url: "/analytics",
  //   badge: null,
  // },
]

const quickAccessItems = [

  {
    title: "Overdue",
    icon: Clock,
    url: "/tasks?filter=overdue",
    badge: "0",
    variant: "destructive" as const,
  },
  // {
  //   title: "Starred",
  //   icon: Star,
  //   url: "/starred",
  //   badge: null,
  // },
]

// const workspaceItems = [
// {
//   title: "Personal",
//   icon: User,
//   projects: 8,
//   color: "bg-blue-500",
// },
// {
//   title: "Work",
//   icon: Building2,
//   projects: 12,
//   color: "bg-green-500",
// },
// {
//   title: "Side Projects",
//   icon: FolderOpen,
//   projects: 4,
//   color: "bg-purple-500",
// },
// ]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthRoute = pathname.startsWith("/authenticate")

  
  if (isAuthRoute || pathname == '/') {
    return null
  }

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm">
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">PPP</h2>
              <p className="text-xs text-sidebar-foreground/60">Enterprise Plan</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-sidebar-accent">
            <Bell className="size-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start text-sidebar-foreground/60 border-sidebar-border/50 hover:bg-sidebar-accent/50 bg-transparent"
          onClick={() => {
            /* TODO: Implement search */
          }}
        >
          <Search className="size-4 mr-2" />
          Search...
          <kbd className="ml-auto text-xs bg-sidebar-accent/50 px-1.5 py-0.5 rounded">⌘K</kbd>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className="h-10 hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground font-medium"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold">Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickAccessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-9 hover:bg-sidebar-accent/50">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      <span className="text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge variant={item.variant || "secondary"} className="ml-auto text-xs h-5 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {/* <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold">Workspaces</SidebarGroupLabel>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-sidebar-accent">
              <Plus className="size-3" />
            </Button>
          </div> */}
          {/* <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((workspace) => (
                <SidebarMenuItem key={workspace.title}>
                  <Collapsible className="group/workspace">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="h-9 hover:bg-sidebar-accent/50 group-data-[state=open]/workspace:bg-sidebar-accent/30">
                        <div className={`size-4 rounded-md ${workspace.color}`} />
                        <span className="text-sm font-medium">{workspace.title}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs text-sidebar-foreground/50">{workspace.projects}</span>
                          <ChevronRight className="size-3 transition-transform duration-200 group-data-[state=open]/workspace:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild className="text-sm">
                            <a href={`/projects?workspace=${workspace.title.toLowerCase()}`}>
                              <FolderOpen className="size-3" />
                              <span>All Projects</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild className="text-sm">
                            <a href={`/projects?workspace=${workspace.title.toLowerCase()}&status=active`}>
                              <CheckSquare className="size-3" />
                              <span>Active Projects</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild className="text-sm">
                            <a href={`/projects?workspace=${workspace.title.toLowerCase()}&status=archived`}>
                              <Archive className="size-3" />
                              <span>Archived</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent> */}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 h-12"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-lg border-2 border-sidebar-border">
                      <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 border-2 border-sidebar" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sidebar-foreground">John Doe</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">john@company.com</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-sidebar-foreground/60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg shadow-lg border-sidebar-border"
                side="top"
                align="start"
                sideOffset={8}
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@company.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Bell className="size-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={async () => {
                    await logout()
                    router.push("/authenticate")
                  }}
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
