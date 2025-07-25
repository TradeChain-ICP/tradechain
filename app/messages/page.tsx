"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  type: "text" | "image" | "file"
  fileUrl?: string
  fileName?: string
  isRead: boolean
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
    role: "buyer" | "seller"
    isOnline: boolean
    lastSeen: string
    rating: number
    isVerified: boolean
  }
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockConversations: Conversation[] = [
          {
            id: "1",
            participant: {
              id: "user-1",
              name: "Sarah Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "buyer",
              isOnline: true,
              lastSeen: new Date().toISOString(),
              rating: 4.9,
              isVerified: true,
            },
            lastMessage: {
              id: "msg-1",
              content: "Hi! I'm interested in your wireless headphones. Are they still available?",
              senderId: "user-1",
              timestamp: new Date(Date.now() - 300000).toISOString(),
              type: "text",
              isRead: false,
            },
            unreadCount: 2,
            messages: [
              {
                id: "msg-1",
                content: "Hi! I'm interested in your wireless headphones. Are they still available?",
                senderId: "user-1",
                timestamp: new Date(Date.now() - 300000).toISOString(),
                type: "text",
                isRead: false,
              },
              {
                id: "msg-2",
                content: "Also, do you offer any warranty on them?",
                senderId: "user-1",
                timestamp: new Date(Date.now() - 240000).toISOString(),
                type: "text",
                isRead: false,
              },
            ],
          },
          {
            id: "2",
            participant: {
              id: "user-2",
              name: "Mike Chen",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "seller",
              isOnline: false,
              lastSeen: new Date(Date.now() - 3600000).toISOString(),
              rating: 4.7,
              isVerified: true,
            },
            lastMessage: {
              id: "msg-3",
              content: "Your order has been shipped! Tracking number: TC123456789",
              senderId: "user-2",
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              type: "text",
              isRead: true,
            },
            unreadCount: 0,
            messages: [
              {
                id: "msg-3",
                content: "Your order has been shipped! Tracking number: TC123456789",
                senderId: "user-2",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                type: "text",
                isRead: true,
              },
            ],
          },
          {
            id: "3",
            participant: {
              id: "user-3",
              name: "Emma Wilson",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "buyer",
              isOnline: true,
              lastSeen: new Date().toISOString(),
              rating: 4.8,
              isVerified: false,
            },
            lastMessage: {
              id: "msg-4",
              content: "Thank you for the quick delivery! The product is exactly as described.",
              senderId: "user-3",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              type: "text",
              isRead: true,
            },
            unreadCount: 0,
            messages: [
              {
                id: "msg-4",
                content: "Thank you for the quick delivery! The product is exactly as described.",
                senderId: "user-3",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                type: "text",
                isRead: true,
              },
            ],
          },
        ]

        setConversations(mockConversations)
        if (mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation, conversations])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: user.id,
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: false,
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
            }
          : conv,
      ),
    )

    setNewMessage("")
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex">
        <div className="w-1/3 border-r bg-gray-50 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-12 bg-gray-200 rounded w-${i % 2 === 0 ? "3/4" : "1/2"} ${i % 2 === 0 ? "ml-auto" : ""}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                  selectedConversation === conversation.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-100",
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversation.participant.name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <p className="font-medium text-sm truncate">{conversation.participant.name}</p>
                      {conversation.participant.isVerified && <Shield className="h-3 w-3 text-blue-500" />}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                      {conversation.unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                    <Badge variant="outline" className="text-xs">
                      {conversation.participant.role}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600 ml-1">{conversation.participant.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConv.participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedConv.participant.name[0]}</AvatarFallback>
                  </Avatar>
                  {selectedConv.participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-medium">{selectedConv.participant.name}</h2>
                    {selectedConv.participant.isVerified && <Shield className="h-4 w-4 text-blue-500" />}
                    <Badge variant="outline" className="text-xs">
                      {selectedConv.participant.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedConv.participant.isOnline
                      ? "Online"
                      : `Last seen ${formatTime(selectedConv.participant.lastSeen)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Block User</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConv.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.senderId === user?.id ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                        message.senderId === user?.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.senderId === user?.id ? "text-blue-100" : "text-gray-500",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    rows={1}
                    className="resize-none"
                  />
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
