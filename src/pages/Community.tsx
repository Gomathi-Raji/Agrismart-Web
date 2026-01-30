import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Calendar, 
  MapPin, 
  Users, 
  Award,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Camera,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  BookOpen,
  ShoppingCart,
  AlertCircle
} from "lucide-react";

// Import community images
import communityDiscussion from "@/assets/community-discussion.jpg";
import knowledgeSharing from "@/assets/knowledge-sharing.jpg";
import agricultureWorkshop from "@/assets/agriculture-workshop.jpg";
import communityMarketplace from "@/assets/community-marketplace.jpg";
import farmerAvatar1 from "@/assets/farmer-avatar-1.jpg";
import farmerAvatar2 from "@/assets/farmer-avatar-2.jpg";
import farmerAvatar3 from "@/assets/farmer-avatar-3.jpg";
import farmerAvatar4 from "@/assets/farmer-avatar-4.jpg";
import farmerAvatar5 from "@/assets/farmer-avatar-5.jpg";
import expertAvatar1 from "@/assets/expert-avatar-1.jpg";
import expertAvatar2 from "@/assets/expert-avatar-2.jpg";
import agriExpertBadge from "@/assets/agri-expert-badge.jpg";
import experiencedFarmerBadge from "@/assets/experienced-farmer-badge.jpg";
import topContributorBadge from "@/assets/top-contributor-badge.jpg";
import innovationBadge from "@/assets/innovation-badge.jpg";
import helperBadge from "@/assets/helper-badge.jpg";
import successStoryIrrigation from "@/assets/success-story-irrigation.jpg";
import tomatoDiseaseRecovery from "@/assets/tomato-disease-recovery.jpg";
import neemOilSpray from "@/assets/neem-oil-spray.jpg";
import seedsMarketplace from "@/assets/seeds-marketplace.jpg";
import fertilizersMarketplace from "@/assets/fertilizers-marketplace.jpg";
import equipmentMarketplace from "@/assets/equipment-marketplace.jpg";
import harvestMarketplace from "@/assets/harvest-marketplace.jpg";
import onlineWorkshop from "@/assets/online-workshop.jpg";
import certificationProgram from "@/assets/certification-program.jpg";
import farmersMeetup from "@/assets/farmers-meetup.jpg";
import innovationFair from "@/assets/innovation-fair.jpg";
import qaSession from "@/assets/qa-session.jpg";
import yieldSuccess from "@/assets/yield-success.jpg";

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    type: "question",
    title: "My tomato plants have yellow leaves - what could be the problem?",
    content: "I've been growing tomatoes for 3 months now, and recently the leaves are turning yellow from the bottom. The plants are getting enough water. What could be causing this?",
    author: {
      name: "Sandhiya",
      location: "Tamil Nadu",
      avatar: farmerAvatar3,
      badge: "Experienced Farmer",
      reputation: 234
    },
    timestamp: "2 hours ago",
    category: "Disease Diagnosis",
    likes: 12,
    replies: 8,
    tags: ["tomatoes", "plant-disease", "yellowing"],
    hasImages: true,
    language: "en",
    postImage: tomatoDiseaseRecovery
  },
  {
    id: 2,
    type: "tip",
    title: "Effective Organic Pest Control Using Neem Oil",
    content: "I've been using neem oil spray for the past 2 years and it's incredibly effective against aphids and whiteflies. Mix 2 tablespoons of neem oil with 1 liter of water and spray in the evening.",
    author: {
      name: "Dr. Priya Sharma",
      location: "Maharashtra",
      avatar: expertAvatar1,
      badge: "Agri Expert",
      reputation: 1250
    },
    timestamp: "1 day ago",
    category: "Pest Control",
    likes: 45,
    replies: 23,
    tags: ["organic", "pest-control", "neem-oil"],
    hasImages: true,
    language: "en",
    postImage: neemOilSpray
  },
  {
    id: 3,
    type: "success-story",
    title: "Increased my crop yield by 40% using smart irrigation",
    content: "Sharing my experience with drip irrigation system. Initial investment was ₹25,000 but saved 60% water and increased yield significantly. Happy to answer questions!",
    author: {
      name: "Krishnan Nair",
      location: "Kerala",
      avatar: farmerAvatar5,
      badge: "Innovation Leader",
      reputation: 578
    },
    timestamp: "3 days ago",
    category: "Success Story",
    likes: 89,
    replies: 34,
    tags: ["irrigation", "water-management", "yield-increase"],
    hasImages: true,
    language: "en",
    postImage: successStoryIrrigation
  },
  {
    id: 4,
    type: "question",
    title: "Best fertilizer for organic vegetable farming?",
    content: "I'm transitioning to organic farming and looking for recommendations on the best organic fertilizers for vegetables. What has worked well for you?",
    author: {
      name: "Sunita Devi",
      location: "Haryana", 
      avatar: farmerAvatar2,
      badge: "New Farmer",
      reputation: 45
    },
    timestamp: "5 hours ago",
    category: "Fertilizers",
    likes: 8,
    replies: 12,
    tags: ["organic", "fertilizers", "vegetables"],
    hasImages: false,
    language: "en"
  },
  {
    id: 5,
    type: "tip",
    title: "Monsoon preparation checklist for farmers",
    content: "Essential steps to prepare your farm for monsoon season. From drainage systems to crop protection, here's what I learned after 15 years of farming.",
    author: {
      name: "Ramesh Patel",
      location: "Gujarat",
      avatar: farmerAvatar4,
      badge: "Weather Expert",
      reputation: 445
    },
    timestamp: "2 days ago",
    category: "Weather",
    likes: 67,
    replies: 28,
    tags: ["monsoon", "preparation", "drainage"],
    hasImages: false,
    language: "en"
  }
];

const mockEvents = [
  {
    id: 1,
    title: "Smart Farming Workshop - AI in Agriculture",
    description: "Learn how to integrate AI tools for crop monitoring and disease detection",
    date: "2024-02-15",
    time: "10:00 AM", 
    location: "Online Webinar",
    organizer: "AgriTech Foundation",
    attendees: 234,
    type: "workshop",
    isRegistered: false,
    image: onlineWorkshop
  },
  {
    id: 2,
    title: "Organic Farming Certification Program",
    description: "3-day certification program for organic farming practices and certification process",
    date: "2024-02-20",
    time: "9:00 AM",
    location: "Bangalore Agricultural Center", 
    organizer: "Organic India",
    attendees: 67,
    type: "certification",
    isRegistered: true,
    image: certificationProgram
  },
  {
    id: 3,
    title: "Regional Farmers Meet - Sustainable Practices",
    description: "Exchange ideas on sustainable farming with local farmers and experts",
    date: "2024-02-25",
    time: "2:00 PM",
    location: "Community Center, Pune",
    organizer: "Farmer's Alliance",
    attendees: 156,
    type: "meetup",
    isRegistered: false,
    image: farmersMeetup
  },
  {
    id: 4,
    title: "Agricultural Innovation Fair 2024",
    description: "Discover latest farming technologies and innovative solutions for modern agriculture",
    date: "2024-03-05",
    time: "10:00 AM",
    location: "Delhi Exhibition Center",
    organizer: "AgriInnovate India",
    attendees: 892,
    type: "exhibition",
    isRegistered: false,
    image: innovationFair
  },
  {
    id: 5,
    title: "Q&A Session with Agricultural Experts",
    description: "Interactive session to get your farming questions answered by industry experts",
    date: "2024-02-28",
    time: "4:00 PM",
    location: "Online Interactive Session",
    organizer: "FarmWise Community",
    attendees: 345,
    type: "interactive",
    isRegistered: true,
    image: qaSession
  }
];

const topContributors = [
  {
    name: "Dr. Priya Sharma",
    location: "Maharashtra",
    avatar: expertAvatar1,
    badge: "Agri Expert",
    reputation: 1250,
    posts: 89,
    solutions: 67
  },
  {
    name: "Krishnan Nair", 
    location: "Kerala",
    avatar: farmerAvatar5,
    badge: "Innovation Leader",
    reputation: 578,
    posts: 45,
    solutions: 34
  },
  {
    name: "Sandhiya",
    location: "Tamil Nadu", 
    avatar: farmerAvatar3,
    badge: "Experienced Farmer",
    reputation: 234,
    posts: 23,
    solutions: 18
  },
  {
    name: "Dr. Amit Singh",
    location: "Uttar Pradesh",
    avatar: expertAvatar2,
    badge: "Research Expert",
    reputation: 892,
    posts: 67,
    solutions: 45
  },
  {
    name: "Ramesh Patel",
    location: "Gujarat",
    avatar: farmerAvatar4,
    badge: "Weather Expert", 
    reputation: 445,
    posts: 34,
    solutions: 28
  }
];

export default function Community() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("discussions");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: language === 'ta' ? "அனைத்தும்" : "All", count: 156 },
    { id: "disease-diagnosis", name: language === 'ta' ? "நோய் கண்டறிதல்" : "Disease Diagnosis", count: 45 },
    { id: "pest-control", name: language === 'ta' ? "பூச்சி கட்டுப்பாடு" : "Pest Control", count: 32 },
    { id: "irrigation", name: language === 'ta' ? "நீர்ப்பாசனம்" : "Irrigation", count: 28 },
    { id: "fertilizers", name: language === 'ta' ? "உரங்கள்" : "Fertilizers", count: 23 },
    { id: "market-prices", name: language === 'ta' ? "சந்தை விலைகள்" : "Market Prices", count: 19 },
    { id: "success-stories", name: language === 'ta' ? "வெற்றிக் கதைகள்" : "Success Stories", count: 15 }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary text-primary-foreground p-6 md:p-8 mb-8">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${communityDiscussion})` }}
        />
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {language === 'ta' ? 'விவசாயிகள் சமூகம்' : 'Farmers Community'}
          </h1>
          <p className="text-primary-foreground/90 text-lg mb-4">
            {language === 'ta' 
              ? 'அறிவைப் பகிர்ந்துகொள்ளுங்கள், கற்றுக்கொள்ளுங்கள் மற்றும் ஒன்றாக வளருங்கள்' 
              : 'Share knowledge, learn together, and grow as one farming community'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>12,500+ {language === 'ta' ? 'உறுப்பினர்கள்' : 'Members'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>2,340 {language === 'ta' ? 'விவாதங்கள்' : 'Discussions'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>890 {language === 'ta' ? 'நிபுணர்கள்' : 'Experts'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discussions">
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'ta' ? 'விவாதங்கள்' : 'Discussions'}
            </TabsTrigger>
            <TabsTrigger value="knowledge">
              <BookOpen className="h-4 w-4 mr-2" />
              {language === 'ta' ? 'அறிவு பகிர்வு' : 'Knowledge'}
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'ta' ? 'நிகழ்வுகள்' : 'Events'}
            </TabsTrigger>
            <TabsTrigger value="marketplace">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {language === 'ta' ? 'சந்தை' : 'Marketplace'}
            </TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'ta' ? 'விவாதங்களைத் தேடுங்கள்...' : 'Search discussions...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {language === 'ta' ? 'வடிகட்டி' : 'Filter'}
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ta' ? 'புதிய கேள்வி' : 'New Question'}
                  </Button>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {mockPosts.map((post) => (
                    <Card key={post.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            {/* Author Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{post.author.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {post.author.badge}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {post.author.location} • {post.timestamp}
                                </span>
                              </div>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>

                            {/* Post Content */}
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                              <p className="text-muted-foreground mb-3">{post.content}</p>
                              
                              {/* Post Image */}
                              {post.postImage && (
                                <div className="mb-3 rounded-lg overflow-hidden">
                                  <img 
                                    src={post.postImage} 
                                    alt={post.title}
                                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                                  />
                                </div>
                              )}
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-4 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {post.replies} {language === 'ta' ? 'பதில்கள்' : 'Replies'}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  <Share2 className="h-4 w-4 mr-1" />
                                  {language === 'ta' ? 'பகிர்' : 'Share'}
                                </Button>
                                {post.hasImages && (
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    <Camera className="h-3 w-3 mr-1" />
                                    {language === 'ta' ? 'படங்கள்' : 'Images'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ta' ? 'பிரிவுகள்' : 'Categories'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                          selectedCategory === category.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent'
                        }`}
                      >
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Top Contributors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ta' ? 'சிறந்த பங்களிப்பாளர்கள்' : 'Top Contributors'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={contributor.name} className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={contributor.avatar} />
                            <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center">
                              <Star className="h-3 w-3 text-warning-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{contributor.name}</p>
                          <p className="text-xs text-muted-foreground">{contributor.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1">
                              {contributor.reputation}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {contributor.solutions} solutions
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Knowledge Sharing Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div 
              className="relative rounded-lg overflow-hidden bg-cover bg-center h-64 flex items-center justify-center"
              style={{ backgroundImage: `url(${knowledgeSharing})` }}
            >
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative text-center text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {language === 'ta' ? 'அறிவைப் பகிர்ந்துகொள்ளுங்கள்' : 'Share Your Knowledge'}
                </h2>
                <p className="mb-4">
                  {language === 'ta' 
                    ? 'உங்கள் வெற்றிகரமான விவசாய நுட்பங்களை மற்றவர்களுடன் பகிர்ந்துகொள்ளுங்கள்' 
                    : 'Share your successful farming techniques with fellow farmers'}
                </p>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ta' ? 'உங்கள் அனுபவத்தை பகிருங்கள்' : 'Share Your Experience'}
                </Button>
              </div>
            </div>

            {/* Knowledge Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: language === 'ta' ? 'வெற்றிக் கதைகள்' : 'Success Stories', 
                  count: 89, 
                  icon: TrendingUp,
                  description: language === 'ta' 
                    ? 'விவசாயிகளின் வெற்றிகரமான முயற்சிகள்' 
                    : 'Successful farming experiences and achievements'
                },
                { 
                  title: language === 'ta' ? 'சிறந்த நடைமுறைகள்' : 'Best Practices', 
                  count: 156, 
                  icon: BookOpen,
                  description: language === 'ta' 
                    ? 'நிரூபிக்கப்பட்ட விவசாய முறைகள்' 
                    : 'Proven farming methods and techniques'
                },
                { 
                  title: language === 'ta' ? 'புதுமை யோசனைகள்' : 'Innovation Ideas', 
                  count: 67, 
                  icon: Award,
                  description: language === 'ta' 
                    ? 'புதிய தொழில்நுட்பம் மற்றும் முறைகள்' 
                    : 'New technologies and innovative approaches'
                }
              ].map((category) => (
                <Card key={category.title} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="secondary">{category.count} {language === 'ta' ? 'பதிவுகள்' : 'Posts'}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div 
              className="relative rounded-lg overflow-hidden bg-cover bg-center h-64 flex items-center justify-center"
              style={{ backgroundImage: `url(${agricultureWorkshop})` }}
            >
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative text-center text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {language === 'ta' ? 'விவசாய நிகழ்வுகள் மற்றும் பட்டறைகள்' : 'Agricultural Events & Workshops'}
                </h2>
                <p className="mb-4">
                  {language === 'ta' 
                    ? 'அருகிலுள்ள பட்டறைகள், கருத்தரங்குகள் மற்றும் பயிற்சி நிகழ்ச்சிகளைக் கண்டறியுங்கள்' 
                    : 'Discover nearby workshops, seminars, and training programs'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockEvents.map((event) => (
                <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Event Image */}
                  {event.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      </div>
                      <Badge variant={event.type === 'workshop' ? 'default' : event.type === 'certification' ? 'secondary' : 'outline'}>
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} {language === 'ta' ? 'பங்கேற்பாளர்கள்' : 'attendees'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ta' ? 'ஏற்பாடு:' : 'Organized by'} {event.organizer}
                      </span>
                      <Button 
                        size="sm" 
                        variant={event.isRegistered ? 'secondary' : 'default'}
                        disabled={event.isRegistered}
                      >
                        {event.isRegistered 
                          ? (language === 'ta' ? 'பதிவு செய்தது' : 'Registered') 
                          : (language === 'ta' ? 'பதிவு செய்யுங்கள்' : 'Register')
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div 
              className="relative rounded-lg overflow-hidden bg-cover bg-center h-64 flex items-center justify-center"
              style={{ backgroundImage: `url(${communityMarketplace})` }}
            >
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative text-center text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {language === 'ta' ? 'சமூக சந்தை' : 'Community Marketplace'}
                </h2>
                <p className="mb-4">
                  {language === 'ta' 
                    ? 'விதைகள், உரங்கள், கருவிகள் வாங்குங்கள் மற்றும் விற்றுங்கள்' 
                    : 'Buy and sell seeds, fertilizers, equipment with fellow farmers'}
                </p>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ta' ? 'பொருட்களை பட்டியலிடுங்கள்' : 'List Your Items'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  category: language === 'ta' ? 'விதைகள்' : 'Seeds', 
                  items: 45, 
                  icon: '🌱',
                  description: language === 'ta' ? 'தரமான விதைகள் மற்றும் நாற்றுகள்' : 'Quality seeds and saplings',
                  image: seedsMarketplace
                },
                { 
                  category: language === 'ta' ? 'உரங்கள்' : 'Fertilizers', 
                  items: 32, 
                  icon: '🧪',
                  description: language === 'ta' ? 'இயற்கை மற்றும் செயற்கை உரங்கள்' : 'Organic and chemical fertilizers',
                  image: fertilizersMarketplace
                },
                { 
                  category: language === 'ta' ? 'கருவிகள்' : 'Equipment', 
                  items: 28, 
                  icon: '🚜',
                  description: language === 'ta' ? 'விவசாய கருவிகள் மற்றும் இயந்திரங்கள்' : 'Farm tools and machinery',
                  image: equipmentMarketplace
                },
                { 
                  category: language === 'ta' ? 'பூச்சிக்கொல்லி' : 'Pesticides', 
                  items: 19, 
                  icon: '🛡️',
                  description: language === 'ta' ? 'பாதுகாப்பான பூச்சிக் கட்டுப்பாட்டு தயாரிப்புகள்' : 'Safe pest control products'
                },
                { 
                  category: language === 'ta' ? 'அறுவடை' : 'Harvest', 
                  items: 67, 
                  icon: '🥕',
                  description: language === 'ta' ? 'விளைபொருட்கள் மற்றும் காய்கறிகள்' : 'Fresh produce and vegetables',
                  image: harvestMarketplace
                },
                { 
                  category: language === 'ta' ? 'சேவைகள்' : 'Services', 
                  items: 23, 
                  icon: '🤝',
                  description: language === 'ta' ? 'விவசாய சேவைகள் மற்றும் ஆலோசனை' : 'Agricultural services and consultation'
                }
              ].map((category) => (
                <Card key={category.category} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                  {/* Category Image */}
                  {category.image && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.category}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-6 text-center">
                    {!category.image && (
                      <div className="text-4xl mb-4">{category.icon}</div>
                    )}
                    <h3 className="font-semibold mb-2">{category.category}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="secondary">
                      {category.items} {language === 'ta' ? 'பொருட்கள்' : 'Items'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}