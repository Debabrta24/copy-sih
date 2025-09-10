import { useState, useEffect, useCallback } from "react";
import { Search, FileText, MessageCircle, Users, Heart, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "resource" | "post" | "page" | "quick-action";
  url: string;
  icon: any;
  category?: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { currentUser } = useAppContext();

  // Quick keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch search data
  const { data: resources } = useQuery({
    queryKey: ["/api/resources"],
    enabled: open,
  });

  const { data: forumPosts } = useQuery({
    queryKey: ["/api/forum/posts"],
    enabled: open,
  });

  // Quick actions
  const quickActions: SearchResult[] = [
    {
      id: "chat",
      title: "AI Support Chat",
      description: "Get instant mental health support",
      type: "quick-action",
      url: "/chat",
      icon: MessageCircle,
    },
    {
      id: "screening",
      title: "Mental Health Screening",
      description: "Take PHQ-9 or GAD-7 assessment",
      type: "quick-action",
      url: "/screening",
      icon: Heart,
    },
    {
      id: "community",
      title: "Community Forum",
      description: "Connect with peer support",
      type: "quick-action",
      url: "/community",
      icon: Users,
    },
    {
      id: "resources",
      title: "Wellness Resources",
      description: "Browse mental health resources",
      type: "quick-action",
      url: "/resources",
      icon: FileText,
    },
  ];

  // Pages
  const pages: SearchResult[] = [
    {
      id: "home",
      title: "Home Dashboard",
      description: "Your personal mental health overview",
      type: "page",
      url: "/",
      icon: Calendar,
    },
    ...(currentUser?.isAdmin ? [{
      id: "admin",
      title: "Admin Dashboard",
      description: "Analytics and user management",
      type: "page" as const,
      url: "/admin",
      icon: Users,
    }] : []),
  ];

  // Filter results based on query
  const filteredResults = useCallback(() => {
    if (!query.trim()) {
      return {
        quickActions: quickActions.slice(0, 4),
        pages: pages.slice(0, 3),
        resources: [],
        posts: [],
      };
    }

    const queryLower = query.toLowerCase();
    const filterByQuery = (items: any[], searchFields: string[]) =>
      (items || []).filter(item => 
        searchFields.some(field => 
          item[field]?.toLowerCase().includes(queryLower)
        )
      );

    const resourcesArray = Array.isArray(resources) ? resources : [];
    const postsArray = Array.isArray(forumPosts) ? forumPosts : [];

    const filteredResources = filterByQuery(resourcesArray, ["title", "description", "category"])
      .slice(0, 5)
      .map((resource: any) => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: "resource" as const,
        url: "/resources",
        icon: FileText,
        category: resource.category,
      }));

    const filteredPosts = filterByQuery(postsArray, ["title", "content", "category"])
      .slice(0, 5)
      .map((post: any) => ({
        id: post.id,
        title: post.title,
        description: post.content?.substring(0, 100) + "...",
        type: "post" as const,
        url: "/community",
        icon: MessageCircle,
        category: post.category,
      }));

    const filteredQuickActions = filterByQuery(quickActions, ["title", "description"]);
    const filteredPages = filterByQuery(pages, ["title", "description"]);

    return {
      quickActions: filteredQuickActions,
      pages: filteredPages,
      resources: filteredResources,
      posts: filteredPosts,
    };
  }, [query, resources, forumPosts, quickActions, pages]);

  const results = filteredResults();
  const hasResults = Object.values(results).some(arr => arr.length > 0);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    setLocation(result.url);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
        data-testid="button-global-search"
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search everything...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search resources, posts, pages..."
          value={query}
          onValueChange={setQuery}
          data-testid="input-global-search"
        />
        <CommandList>
          {!hasResults && (
            <CommandEmpty>
              {query ? "No results found." : "Start typing to search..."}
            </CommandEmpty>
          )}

          {results.quickActions.length > 0 && (
            <CommandGroup heading="Quick Actions">
              {results.quickActions.map((result) => {
                const IconComponent = result.icon;
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-2 px-2 py-3"
                    data-testid={`search-result-${result.type}-${result.id}`}
                  >
                    <IconComponent className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-sm text-muted-foreground">{result.description}</span>
                    </div>
                    <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {results.pages.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Pages">
                {results.pages.map((result) => {
                  const IconComponent = result.icon;
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-2 px-2 py-3"
                      data-testid={`search-result-${result.type}-${result.id}`}
                    >
                      <IconComponent className="h-4 w-4 text-secondary" />
                      <div className="flex flex-col">
                        <span className="font-medium">{result.title}</span>
                        <span className="text-sm text-muted-foreground">{result.description}</span>
                      </div>
                      <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {results.resources.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Resources">
                {results.resources.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-2 px-2 py-3"
                    data-testid={`search-result-${result.type}-${result.id}`}
                  >
                    <FileText className="h-4 w-4 text-accent" />
                    <div className="flex flex-col">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-sm text-muted-foreground">{result.description}</span>
                      {result.category && (
                        <span className="text-xs text-muted-foreground">in {result.category}</span>
                      )}
                    </div>
                    <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {results.posts.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Community Posts">
                {results.posts.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-2 px-2 py-3"
                    data-testid={`search-result-${result.type}-${result.id}`}
                  >
                    <MessageCircle className="h-4 w-4 text-chart-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-sm text-muted-foreground">{result.description}</span>
                      {result.category && (
                        <span className="text-xs text-muted-foreground">in {result.category}</span>
                      )}
                    </div>
                    <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}