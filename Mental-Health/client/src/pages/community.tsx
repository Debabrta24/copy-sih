import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  ShieldQuestion, 
  Plus, 
  Heart, 
  MessageSquare, 
  Flag,
  Users,
  CheckCircle,
  BookOpen,
  Lightbulb,
  Star,
  TrendingUp,
  Award,
  Code,
  Palette,
  GraduationCap,
  Trophy,
  Eye,
  ThumbsUp,
  ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumPost from "@/components/community/forum-post";
import type { ForumPost as ForumPostType } from "@/types";
import { BackButton } from "@/components/ui/back-button";

const categories = [
  "Exam Stress",
  "Social Anxiety", 
  "Depression Support",
  "Study Motivation",
  "Peer Pressure",
  "Career Anxiety",
  "Family Issues",
  "General Support"
];

const skillCategories = [
  "technical",
  "creative", 
  "academic",
  "sports",
  "other"
];

const proficiencyLevels = [
  "beginner",
  "intermediate", 
  "advanced",
  "expert"
];

const showcaseTypes = [
  "project",
  "achievement",
  "certificate", 
  "portfolio"
];

const moderators = [
  { pseudonym: "PeerMod_Alex", role: "Psychology Student", color: "bg-primary" },
  { pseudonym: "WellnessHelper_Priya", role: "Counseling Intern", color: "bg-secondary" },
];

export default function Community() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isCreateShowcaseOpen, setIsCreateShowcaseOpen] = useState(false);
  
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: true,
  });

  const [newSkill, setNewSkill] = useState({
    skillName: "",
    category: "",
    proficiencyLevel: "",
    description: "",
    yearsOfExperience: 0,
  });

  const [newShowcase, setNewShowcase] = useState({
    skillId: "",
    title: "",
    description: "",
    type: "",
    mediaUrl: "",
    externalUrl: "",
    tags: [] as string[],
  });

  const { data: forumPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/forum/posts"],
  });

  const { data: userSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["/api/skills"],
  });

  const { data: skillShowcases, isLoading: isLoadingShowcases } = useQuery({
    queryKey: ["/api/skill-showcases"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/forum/posts", {
        ...postData,
        userId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setIsCreatePostOpen(false);
      setNewPost({ title: "", content: "", category: "", isAnonymous: true });
      toast({
        title: "Post created",
        description: "Your post has been submitted for moderation.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (skillData: any) => {
      return await apiRequest("POST", "/api/skills", {
        ...skillData,
        userId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setIsAddSkillOpen(false);
      setNewSkill({ skillName: "", category: "", proficiencyLevel: "", description: "", yearsOfExperience: 0 });
      toast({
        title: "Skill added",
        description: "Your skill has been added to your profile.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createShowcaseMutation = useMutation({
    mutationFn: async (showcaseData: any) => {
      return await apiRequest("POST", "/api/skill-showcases", {
        ...showcaseData,
        userId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skill-showcases"] });
      setIsCreateShowcaseOpen(false);
      setNewShowcase({ skillId: "", title: "", description: "", type: "", mediaUrl: "", externalUrl: "", tags: [] });
      toast({
        title: "Showcase created",
        description: "Your skill showcase has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create showcase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const handleCreateSkill = () => {
    if (!newSkill.skillName.trim() || !newSkill.category || !newSkill.proficiencyLevel) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createSkillMutation.mutate(newSkill);
  };

  const handleCreateShowcase = () => {
    if (!newShowcase.skillId || !newShowcase.title.trim() || !newShowcase.description.trim() || !newShowcase.type) {
      toast({
        title: "Missing information", 
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createShowcaseMutation.mutate(newShowcase);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'technical': return Code;
      case 'creative': return Palette;
      case 'academic': return GraduationCap;
      case 'sports': return Trophy;
      default: return Star;
    }
  };

  const getProficiencyColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Hub</h1>
              <p className="text-blue-700 dark:text-blue-300">Connect, share experiences, and showcase your talents</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Safe Space</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Anonymous support discussions</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Peer Support</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Share experiences with students</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Skill Showcase</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Display your talents and achievements</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Learn Together</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Discover new skills and inspiration</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Support Forum
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Skill Showcase
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setIsCreatePostOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    data-testid="button-create-post-sidebar"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    💡 Your posts are always anonymous and reviewed by trained peer moderators
                  </div>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Be respectful and supportive to all members</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Share personal experiences, not professional advice</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Maintain anonymity for everyone's safety</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Report content that may be harmful</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Active Moderators */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <ShieldQuestion className="h-5 w-5 mr-2 text-purple-600" />
                    Peer Moderators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moderators.map((mod, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <ShieldQuestion className="text-white h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{mod.pseudonym}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{mod.role}</p>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-800">
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      <BookOpen className="inline h-3 w-3 mr-1" />
                      Our moderators are trained students who understand your challenges
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Discussion Forum */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discussion Forum</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Share your experiences and find support from fellow students</p>
                </div>
                
                <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium" data-testid="button-create-post">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Share Your Experience</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Title
                        </label>
                        <Input
                          placeholder="Share a brief, supportive title..."
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          data-testid="input-post-title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <Select 
                          value={newPost.category} 
                          onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                        >
                          <SelectTrigger data-testid="select-post-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Experience
                        </label>
                        <Textarea
                          placeholder="Share your experience, feelings, or ask for peer support. Remember to be respectful and supportive."
                          rows={5}
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          data-testid="textarea-post-content"
                        />
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <Shield className="inline h-4 w-4 mr-2" />
                          Your post will be shared anonymously and reviewed by trained peer moderators before appearing in the forum.
                        </p>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCreatePostOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreatePost}
                          disabled={createPostMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          data-testid="button-submit-post"
                        >
                          {createPostMutation.isPending ? "Posting..." : "Share Post"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {isLoadingPosts ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-4"></div>
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-4"></div>
                        <div className="h-8 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : !forumPosts || (forumPosts as any)?.length === 0 ? (
                  <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start the Conversation</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Be the first to share your experience and create a supportive space for fellow students.
                      </p>
                      <Button 
                        onClick={() => setIsCreatePostOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  (forumPosts as any)?.map?.((post: ForumPostType) => (
                    <ForumPost key={post.id} post={post as ForumPostType & { replies?: any[] }} />
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Skills Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-purple-600" />
                    Showcase Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setIsAddSkillOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    data-testid="button-add-skill"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                  <Button 
                    onClick={() => setIsCreateShowcaseOpen(true)}
                    variant="outline"
                    className="w-full"
                    data-testid="button-create-showcase"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Create Showcase
                  </Button>
                  <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    🎯 Showcase your talents and inspire fellow students
                  </div>
                </CardContent>
              </Card>

              {/* Your Skills */}
              <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Your Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingSkills ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : !userSkills || (userSkills as any)?.length === 0 ? (
                    <div className="text-center py-6">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No skills added yet</p>
                      <Button 
                        size="sm" 
                        onClick={() => setIsAddSkillOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Add Your First Skill
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(userSkills as any)?.slice(0, 3).map((skill: any) => {
                        const IconComponent = getCategoryIcon(skill.category);
                        return (
                          <div key={skill.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <IconComponent className="h-5 w-5 text-purple-600 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{skill.skillName}</p>
                                <Badge className={`text-xs mt-1 ${getProficiencyColor(skill.proficiencyLevel)}`}>
                                  {skill.proficiencyLevel}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {(userSkills as any)?.length > 3 && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          +{(userSkills as any).length - 3} more skills
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Skills Showcase */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Showcase</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Discover amazing talents from fellow students</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoadingShowcases ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-3"></div>
                        <div className="h-6 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : !skillShowcases || (skillShowcases as any)?.length === 0 ? (
                  <div className="col-span-2">
                    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Award className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Be the First to Showcase</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          Share your amazing skills and inspire other students in the community.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button 
                            onClick={() => setIsAddSkillOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Skills First
                          </Button>
                          <Button 
                            onClick={() => setIsCreateShowcaseOpen(true)}
                            variant="outline"
                          >
                            Create Showcase
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  (skillShowcases as any)?.map?.((showcase: any) => (
                    <Card key={showcase.id} className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-t-lg flex items-center justify-center">
                        {showcase.mediaUrl ? (
                          <img src={showcase.mediaUrl} alt={showcase.title} className="w-full h-full object-cover rounded-t-lg" />
                        ) : (
                          <Award className="h-12 w-12 text-purple-500" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{showcase.title}</h3>
                          <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {showcase.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{showcase.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{showcase.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{showcase.views || 0}</span>
                            </div>
                          </div>
                          {showcase.externalUrl && (
                            <a 
                              href={showcase.externalUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 text-xs flex items-center space-x-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View Project</span>
                            </a>
                          )}
                        </div>
                        
                        {showcase.tags && showcase.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {showcase.tags.slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Add Your Skill</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skill Name *
              </label>
              <Input
                placeholder="e.g., React Development, Digital Art, Public Speaking"
                value={newSkill.skillName}
                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                data-testid="input-skill-name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <Select 
                  value={newSkill.category} 
                  onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                >
                  <SelectTrigger data-testid="select-skill-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proficiency Level *
                </label>
                <Select 
                  value={newSkill.proficiencyLevel} 
                  onValueChange={(value) => setNewSkill({ ...newSkill, proficiencyLevel: value })}
                >
                  <SelectTrigger data-testid="select-proficiency-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <Input
                type="number"
                min="0"
                max="50"
                placeholder="0"
                value={newSkill.yearsOfExperience}
                onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })}
                data-testid="input-years-experience"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your skill, what you can do with it, any notable achievements..."
                rows={3}
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                data-testid="textarea-skill-description"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddSkillOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSkill}
                disabled={createSkillMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-submit-skill"
              >
                {createSkillMutation.isPending ? "Adding..." : "Add Skill"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Showcase Dialog */}
      <Dialog open={isCreateShowcaseOpen} onOpenChange={setIsCreateShowcaseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Create Skill Showcase</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Skill *
              </label>
              <Select 
                value={newShowcase.skillId} 
                onValueChange={(value) => setNewShowcase({ ...newShowcase, skillId: value })}
              >
                <SelectTrigger data-testid="select-showcase-skill">
                  <SelectValue placeholder="Choose a skill to showcase" />
                </SelectTrigger>
                <SelectContent>
                  {(userSkills as any)?.map((skill: any) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.skillName} ({skill.proficiencyLevel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(!userSkills || (userSkills as any)?.length === 0) && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  You need to add skills first before creating a showcase
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <Input
                placeholder="e.g., My Portfolio Website, Award-winning Art Project"
                value={newShowcase.title}
                onChange={(e) => setNewShowcase({ ...newShowcase, title: e.target.value })}
                data-testid="input-showcase-title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type *
              </label>
              <Select 
                value={newShowcase.type} 
                onValueChange={(value) => setNewShowcase({ ...newShowcase, type: value })}
              >
                <SelectTrigger data-testid="select-showcase-type">
                  <SelectValue placeholder="Select showcase type" />
                </SelectTrigger>
                <SelectContent>
                  {showcaseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Describe your showcase, what makes it special, what you learned..."
                rows={4}
                value={newShowcase.description}
                onChange={(e) => setNewShowcase({ ...newShowcase, description: e.target.value })}
                data-testid="textarea-showcase-description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Media URL (optional)
                </label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newShowcase.mediaUrl}
                  onChange={(e) => setNewShowcase({ ...newShowcase, mediaUrl: e.target.value })}
                  data-testid="input-media-url"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project URL (optional)
                </label>
                <Input
                  placeholder="https://github.com/user/project"
                  value={newShowcase.externalUrl}
                  onChange={(e) => setNewShowcase({ ...newShowcase, externalUrl: e.target.value })}
                  data-testid="input-external-url"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (optional)
              </label>
              <Input
                placeholder="react, web-design, responsive (comma separated)"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  setNewShowcase({ ...newShowcase, tags });
                }}
                data-testid="input-showcase-tags"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateShowcaseOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateShowcase}
                disabled={createShowcaseMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-submit-showcase"
              >
                {createShowcaseMutation.isPending ? "Creating..." : "Create Showcase"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}