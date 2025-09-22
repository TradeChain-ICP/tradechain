// app/dashboard/seller/messages/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Send,
  ArrowLeft,
  Package,
  Eye,
  CheckCircle,
  Shield,
  Star,
  Clock,
  MessageSquare,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { useContentPadding } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: 'text' | 'order_inquiry' | 'order_update';
  isRead: boolean;
  orderData?: {
    orderId: string;
    productName: string;
    status: string;
    amount: string;
  };
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role: 'buyer' | 'seller';
    isOnline: boolean;
    lastSeen: string;
    rating: number;
    isVerified: boolean;
    totalOrders: number;
  };
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
  relatedOrders?: string[];
  priority: 'high' | 'normal' | 'low';
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { contentPadding } = useContentPadding();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockConversations: Conversation[] = [
          {
            id: '1',
            participant: {
              id: 'buyer-1',
              name: 'Sarah Johnson',
              avatar: '/placeholder.svg?height=32&width=32',
              role: 'buyer',
              isOnline: true,
              lastSeen: new Date().toISOString(),
              rating: 4.9,
              isVerified: true,
              totalOrders: 12,
            },
            lastMessage: {
              id: 'msg-1',
              content:
                'Hi, I need bulk pricing for gold bullion - 10+ pieces for institutional purchase',
              senderId: 'buyer-1',
              timestamp: new Date(Date.now() - 300000).toISOString(),
              type: 'text',
              isRead: false,
            },
            unreadCount: 2,
            relatedOrders: ['ORD-7292'],
            priority: 'high',
            messages: [
              {
                id: 'msg-1',
                content:
                  'Hi, I need bulk pricing for gold bullion - 10+ pieces for institutional purchase',
                senderId: 'buyer-1',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                type: 'text',
                isRead: false,
              },
              {
                id: 'msg-2',
                content: 'Timeline is urgent - need delivery to NYC by Friday',
                senderId: 'buyer-1',
                timestamp: new Date(Date.now() - 240000).toISOString(),
                type: 'text',
                isRead: false,
              },
            ],
          },
          {
            id: '2',
            participant: {
              id: 'buyer-2',
              name: 'Mike Chen',
              avatar: '/placeholder.svg?height=32&width=32',
              role: 'buyer',
              isOnline: false,
              lastSeen: new Date(Date.now() - 3600000).toISOString(),
              rating: 4.7,
              isVerified: true,
              totalOrders: 8,
            },
            lastMessage: {
              id: 'msg-4',
              content: 'Order delivered successfully. Thanks for the quick processing.',
              senderId: 'buyer-2',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              type: 'order_update',
              isRead: true,
              orderData: {
                orderId: 'ORD-7291',
                productName: 'Silver Bars - 10oz',
                status: 'Delivered',
                amount: '$2,800.00',
              },
            },
            unreadCount: 0,
            relatedOrders: ['ORD-7291'],
            priority: 'normal',
            messages: [
              {
                id: 'msg-4',
                content: 'Order delivered successfully. Thanks for the quick processing.',
                senderId: 'buyer-2',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                type: 'order_update',
                isRead: true,
                orderData: {
                  orderId: 'ORD-7291',
                  productName: 'Silver Bars - 10oz',
                  status: 'Delivered',
                  amount: '$2,800.00',
                },
              },
            ],
          },
          {
            id: '3',
            participant: {
              id: 'buyer-3',
              name: 'Emma Wilson',
              avatar: '/placeholder.svg?height=32&width=32',
              role: 'buyer',
              isOnline: false,
              lastSeen: new Date(Date.now() - 86400000).toISOString(),
              rating: 4.8,
              isVerified: false,
              totalOrders: 3,
            },
            lastMessage: {
              id: 'msg-5',
              content: 'Need certificate of authenticity for platinum coins order',
              senderId: 'buyer-3',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              type: 'order_inquiry',
              isRead: true,
              orderData: {
                orderId: 'ORD-7285',
                productName: 'Platinum Coin - 1oz',
                status: 'Processing',
                amount: '$980.00',
              },
            },
            unreadCount: 0,
            relatedOrders: ['ORD-7285'],
            priority: 'normal',
            messages: [
              {
                id: 'msg-5',
                content: 'Need certificate of authenticity for platinum coins order',
                senderId: 'buyer-3',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                type: 'order_inquiry',
                isRead: true,
                orderData: {
                  orderId: 'ORD-7285',
                  productName: 'Platinum Coin - 1oz',
                  status: 'Processing',
                  amount: '$980.00',
                },
              },
            ],
          },
        ];

        setConversations(mockConversations);
        if (mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: user.id,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
            }
          : conv
      )
    );

    setNewMessage('');
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || conv.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/30';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30';
      case 'low':
        return 'border-l-gray-400 bg-gray-50 dark:bg-gray-900/30';
      default:
        return 'border-l-gray-400 bg-background';
    }
  };

  if (loading) {
    return (
      <div className={`h-[calc(100vh-4rem)] ${contentPadding} lg:pr-0`}>
        <div className="flex h-full border rounded-lg overflow-hidden bg-card">
          <div className="w-80 border-r bg-muted/20">
            <div className="p-4 space-y-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-6 bg-muted rounded w-16"></div>
                ))}
              </div>
            </div>
            <div className="px-2 space-y-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-muted rounded-full mx-auto"></div>
              <div className="h-4 bg-muted rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[calc(100vh-4rem)] ${contentPadding} lg:pr-0`}>
      <div className="flex h-full border rounded-lg overflow-hidden bg-card">
        {/* Conversations List */}
        <div
          className={cn(
            'w-80 border-r bg-muted/20 flex flex-col',
            selectedConversation && 'hidden lg:flex'
          )}
        >
          {/* Header */}
          <div className="p-4 border-b bg-background/95">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">
                {user?.role === 'seller' ? 'Customer Messages' : 'Seller Messages'}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} unread
              </Badge>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={user?.role === 'seller' ? 'Search customers...' : 'Search sellers...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex gap-1">
              {['all', 'high', 'normal', 'low'].map((priority) => (
                <Button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  variant={priorityFilter === priority ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-2"
                >
                  {priority === 'all' ? 'All' : priority}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border-l-2',
                    getPriorityColor(conversation.priority),
                    selectedConversation === conversation.id
                      ? 'ring-1 ring-primary/20'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={conversation.participant.avatar} />
                    <AvatarFallback className="text-sm font-medium">
                      {conversation.participant.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm truncate">
                          {conversation.participant.name}
                        </p>
                        {conversation.participant.isVerified && (
                          <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {conversation.lastMessage.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {conversation.participant.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {conversation.participant.totalOrders} orders
                        </span>
                      </div>

                      {conversation.relatedOrders && (
                        <Badge variant="outline" className="text-xs h-5">
                          Order #{conversation.relatedOrders[0]?.slice(-4)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn('flex-1 flex flex-col', !selectedConversation && 'hidden lg:flex')}>
          {selectedConv ? (
            <>
              {/* Mobile Back Button */}
              <div className="lg:hidden p-3 border-b bg-background/95">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedConversation(null)}
                  className="text-sm"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {/* Chat Header */}
              <div className="p-4 border-b bg-background/95">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedConv.participant.avatar} />
                      <AvatarFallback className="text-sm">
                        {selectedConv.participant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{selectedConv.participant.name}</h3>
                        {selectedConv.participant.isVerified && (
                          <Shield className="h-3 w-3 text-blue-500" />
                        )}
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full',
                            selectedConv.participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          )}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedConv.participant.totalOrders} orders •{' '}
                        {selectedConv.participant.rating} rating
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {selectedConv.relatedOrders && (
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Package className="h-3 w-3 mr-1" />
                        Order
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          View {selectedConv.participant.role === 'buyer' ? 'Customer' : 'Seller'} Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Order History</DropdownMenuItem>
                        {user?.role === 'seller' && (
                          <DropdownMenuItem>Create Quote</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          Block {selectedConv.participant.role === 'buyer' ? 'Customer' : 'Seller'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConv.messages.map((message) => (
                    <div key={message.id} className="space-y-3">
                      {/* Order Card */}
                      {message.orderData && (
                        <Card className="border-primary/20 bg-primary/5">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-primary">
                                  Order #{message.orderData.orderId}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {message.orderData.productName}
                                </p>
                                <p className="text-sm font-medium">{message.orderData.amount}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{message.orderData.status}</Badge>
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={cn(
                          'flex gap-3',
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.senderId !== user?.id && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={selectedConv.participant.avatar} />
                            <AvatarFallback className="text-xs">
                              {selectedConv.participant.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            'max-w-sm px-3 py-2 rounded-lg text-sm',
                            message.senderId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          )}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-1 gap-2">
                            <span
                              className={cn(
                                'text-xs',
                                message.senderId === user?.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {formatTime(message.timestamp)}
                            </span>
                            {message.senderId === user?.id && message.isRead && (
                              <CheckCircle className="h-3 w-3 text-primary-foreground/70" />
                            )}
                          </div>
                        </div>

                        {message.senderId === user?.id && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-xs">
                              {user?.firstName?.[0] || 'Y'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-background/95">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="resize-none min-h-[2.5rem] max-h-20 text-sm"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="h-12 w-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a {user?.role === 'seller' ? 'customer' : 'seller'} to start messaging
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
