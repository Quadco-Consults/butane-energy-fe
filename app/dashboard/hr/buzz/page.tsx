'use client'

import React, { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Plus, Heart, MessageCircle, Share2, Send, Calendar, MapPin,
  Users, Briefcase, Trophy, Coffee, Gift, Camera, Paperclip,
  ThumbsUp, Eye, Clock, Star, TrendingUp
} from 'lucide-react'

interface Post {
  id: string
  author: {
    name: string
    position: string
    department: string
    avatar: string
    initials: string
  }
  content: string
  type: 'announcement' | 'achievement' | 'event' | 'general' | 'celebration'
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  tags: string[]
  images?: string[]
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: 'meeting' | 'training' | 'social' | 'conference'
  attendees: number
  maxAttendees: number
}

interface Achievement {
  id: string
  employee: string
  title: string
  description: string
  date: string
  category: 'performance' | 'milestone' | 'recognition' | 'certification'
}

export default function HRBuzzPage() {
  const { user } = useAuth()
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedTab, setSelectedTab] = useState('feed')

  if (!user) return null

  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Adaobi Okechukwu',
        position: 'HR Manager',
        department: 'Human Resources',
        avatar: '',
        initials: 'AO'
      },
      content: 'Exciting news! We are launching our new employee wellness program starting next month. This comprehensive program will include fitness classes, mental health support, and nutrition counseling. Looking forward to seeing everyone participate! 🌟',
      type: 'announcement',
      timestamp: '2024-11-15 09:30',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      tags: ['wellness', 'announcement', 'health']
    },
    {
      id: '2',
      author: {
        name: 'Chinedu Okafor',
        position: 'Senior Developer',
        department: 'Engineering',
        avatar: '',
        initials: 'CO'
      },
      content: 'Just completed my AWS Solutions Architect certification! Thank you to the company for supporting my professional development. The cloud migration project here we come! ☁️🚀',
      type: 'achievement',
      timestamp: '2024-11-15 08:15',
      likes: 45,
      comments: 12,
      shares: 5,
      isLiked: true,
      tags: ['certification', 'aws', 'achievement']
    },
    {
      id: '3',
      author: {
        name: 'Kemi Adebayo',
        position: 'Marketing Coordinator',
        department: 'Marketing',
        avatar: '',
        initials: 'KA'
      },
      content: 'Team building event this Friday at Victoria Island! 🏖️ We\'ll have beach volleyball, BBQ, and lots of fun activities. Don\'t forget to RSVP by Wednesday. Can\'t wait to see everyone there!',
      type: 'event',
      timestamp: '2024-11-14 16:45',
      likes: 32,
      comments: 15,
      shares: 7,
      isLiked: false,
      tags: ['teambuilding', 'event', 'friday']
    },
    {
      id: '4',
      author: {
        name: 'Taiwo Adeniyi',
        position: 'Finance Director',
        department: 'Finance',
        avatar: '',
        initials: 'TA'
      },
      content: 'Congratulations to our entire Sales team for exceeding Q4 targets by 115%! This outstanding performance reflects the hard work and dedication of everyone involved. Well done team! 🎉📈',
      type: 'celebration',
      timestamp: '2024-11-14 14:20',
      likes: 67,
      comments: 23,
      shares: 11,
      isLiked: true,
      tags: ['sales', 'q4', 'celebration', 'targets']
    }
  ]

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'All Hands Meeting',
      date: '2024-11-20',
      time: '10:00 AM',
      location: 'Conference Room A',
      type: 'meeting',
      attendees: 45,
      maxAttendees: 50
    },
    {
      id: '2',
      title: 'Leadership Training Workshop',
      date: '2024-11-22',
      time: '09:00 AM',
      location: 'Training Center',
      type: 'training',
      attendees: 15,
      maxAttendees: 20
    },
    {
      id: '3',
      title: 'End of Year Party',
      date: '2024-12-15',
      time: '06:00 PM',
      location: 'Lagos Continental Hotel',
      type: 'social',
      attendees: 120,
      maxAttendees: 150
    }
  ]

  const recentAchievements: Achievement[] = [
    {
      id: '1',
      employee: 'Sarah Okonkwo',
      title: 'Employee of the Month',
      description: 'Outstanding performance in customer service delivery',
      date: '2024-11-01',
      category: 'recognition'
    },
    {
      id: '2',
      employee: 'Michael Eze',
      title: '5 Year Work Anniversary',
      description: 'Celebrating 5 years of dedicated service to the company',
      date: '2024-11-10',
      category: 'milestone'
    },
    {
      id: '3',
      employee: 'Funmi Bakare',
      title: 'Project Management Certification',
      description: 'Successfully completed PMP certification program',
      date: '2024-11-12',
      category: 'certification'
    }
  ]

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800'
      case 'achievement': return 'bg-green-100 text-green-800'
      case 'event': return 'bg-purple-100 text-purple-800'
      case 'celebration': return 'bg-yellow-100 text-yellow-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Briefcase className="h-4 w-4" />
      case 'achievement': return <Trophy className="h-4 w-4" />
      case 'event': return <Calendar className="h-4 w-4" />
      case 'celebration': return <Gift className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'training': return 'bg-green-100 text-green-800'
      case 'social': return 'bg-purple-100 text-purple-800'
      case 'conference': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HR Buzz</h1>
            <p className="text-gray-500 mt-1">Stay connected with your colleagues and company updates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hidden sm:flex">
              <Camera className="mr-2 h-4 w-4" />
              Photo
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's on your mind? Share updates, announcements, or celebrate achievements..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[80px] resize-none border-gray-200"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4 mr-1" />
                          Attach
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-1" />
                          Photo
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                {/* Posts Feed */}
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      {/* Post Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {post.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            <Badge className={getPostTypeColor(post.type)} variant="secondary">
                              {getPostTypeIcon(post.type)}
                              <span className="ml-1 capitalize">{post.type}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{post.author.position} • {post.author.department}</p>
                          <p className="text-xs text-gray-400">{formatTime(post.timestamp)}</p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{post.content}</p>
                        {post.tags.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {post.tags.map((tag) => (
                              <span key={tag} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator className="mb-4" />

                      {/* Post Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${post.isLiked ? 'text-red-600' : 'text-gray-500'}`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                            <Share2 className="h-4 w-4" />
                            {post.shares}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Eye className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 200) + 50} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Don't miss these upcoming company events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge className={getEventTypeColor(event.type)} variant="secondary">
                              {event.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(event.date)} at {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.attendees}/{event.maxAttendees}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          RSVP
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                    <CardDescription>Celebrating our team's success and milestones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-3 rounded-full bg-yellow-100">
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.employee}</h3>
                          <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(achievement.date)}</p>
                        </div>
                        <Badge variant="outline">
                          {achievement.category}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Topics</CardTitle>
                    <CardDescription>What's buzzing in the company right now</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['#wellness', '#aws', '#teambuilding', '#q4results', '#certification'].map((tag, index) => (
                        <div key={tag} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded text-sm font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-blue-600">{tag}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <TrendingUp className="h-4 w-4" />
                            {Math.floor(Math.random() * 50) + 10} posts
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Company Pulse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold text-green-600">124/150</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posts This Week</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Upcoming Events</span>
                  <span className="font-semibold text-purple-600">{upcomingEvents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Celebrations</span>
                  <span className="font-semibold text-yellow-600">5</span>
                </div>
              </CardContent>
            </Card>

            {/* Who's Online */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Who's Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Adaobi Okechukwu', 'Chinedu Okafor', 'Kemi Adebayo', 'Taiwo Adeniyi', 'Sarah Okonkwo'].map((name) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-green-500 to-blue-600 text-white">
                            {name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-700">{name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Coffee className="mr-2 h-4 w-4" />
                  Coffee Chat
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Find Colleagues
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4" />
                  Give Recognition
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Gift className="mr-2 h-4 w-4" />
                  Celebrate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}