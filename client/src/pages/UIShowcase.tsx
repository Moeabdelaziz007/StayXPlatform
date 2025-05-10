import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { ChillRoom } from "@/components/ui/chill-room";
import { Drop } from "@/components/ui/drop";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";

const UIShowcase: React.FC = () => {
  return (
    <Layout title="UI Components">
      <section className="mb-12">
        <h1 className="text-3xl font-bold font-poppins mb-6">StayX UI Kit</h1>
        <p className="text-gray-medium mb-8">
          A complete UI/UX set for the StayX platform with Bitcoin, space, and tech themes featuring neon green accents.
        </p>
      </section>

      {/* Button section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-poppins mb-4">Buttons</h2>
        <div className="bg-dark-card rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Button variant="default">Primary Button</Button>
              <p className="text-xs text-gray-medium">Default</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline">Outline Button</Button>
              <p className="text-xs text-gray-medium">Outline</p>
            </div>
            <div className="space-y-2">
              <Button variant="glow">Glow Button</Button>
              <p className="text-xs text-gray-medium">Glow Effect</p>
            </div>
            <div className="space-y-2">
              <Button variant="tech">Tech Button</Button>
              <p className="text-xs text-gray-medium">Tech Style</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Button variant="default" size="sm">Small</Button>
            </div>
            <div className="space-y-2">
              <Button variant="default" size="default">Default</Button>
            </div>
            <div className="space-y-2">
              <Button variant="default" size="lg">Large</Button>
            </div>
            <div className="space-y-2">
              <Button variant="default" size="xl">Extra Large</Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Button variant="default" disabled>Disabled</Button>
            </div>
            <div className="space-y-2">
              <Button variant="ghost">
                <i className="ri-github-line mr-2"></i>
                With Icon
              </Button>
            </div>
            <div className="space-y-2">
              <Button variant="default" size="icon">
                <i className="ri-bitcoin-line"></i>
              </Button>
            </div>
            <div className="space-y-2">
              <Button variant="link">Link Button</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cards section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-poppins mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>The standard card component</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the content of the card. It can contain any information you want to display.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="crypto">
            <CardHeader>
              <CardTitle>Crypto Card</CardTitle>
              <CardDescription>With crypto grid background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Features a subtle grid pattern background that gives it a tech/crypto feel.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <i className="ri-bitcoin-line mr-2"></i>
                Trade
              </Button>
            </CardFooter>
          </Card>
          
          <Card variant="glow">
            <CardHeader>
              <CardTitle>Glow Card</CardTitle>
              <CardDescription>With neon green glow effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Has a subtle glow effect around the border to highlight important content.</p>
            </CardContent>
            <CardFooter>
              <Button variant="glow" size="sm">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Gradient Border</CardTitle>
              <CardDescription>With animated gradient border</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Features a gradient border that adds visual interest to the card.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>With hover animation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a hover effect that lifts it up slightly and adds a subtle shadow.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="dark">
            <CardHeader>
              <CardTitle>Dark Card</CardTitle>
              <CardDescription>Even darker background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>For when you need even more contrast with the darkest background option.</p>
            </CardContent>
            <CardFooter>
              <Button variant="default" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Chat Bubbles section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-poppins mb-4">Chat Bubbles</h2>
        <Card variant="default" className="p-6">
          <div className="space-y-4">
            <ChatBubble 
              variant="sender" 
              message="Hey, have you seen the latest Bitcoin price? 🚀" 
              sender={{
                name: "Jane Doe",
                timestamp: new Date()
              }}
              showAvatar={true}
            />
            
            <ChatBubble 
              variant="receiver" 
              message="Yes! It's up 5% today. I think we might see a strong rally this week." 
              sender={{
                name: "John Smith",
                timestamp: new Date()
              }}
              showAvatar={true}
            />
            
            <ChatBubble 
              variant="system" 
              message="John shared a link to the conversation" 
              sender={{
                name: "System",
                timestamp: new Date()
              }}
            />
            
            <ChatBubble 
              variant="bitcoin" 
              message="Bitcoin price alert: BTC has crossed $45,000 resistance level" 
              sender={{
                name: "Crypto Alert",
                timestamp: new Date()
              }}
            />
            
            <ChatBubble 
              variant="ai" 
              message="Based on recent market patterns, there's a 73% probability of continued upward momentum for Bitcoin over the next 48 hours." 
              sender={{
                name: "StayX AI",
                timestamp: new Date()
              }}
              showAvatar={true}
            />
            
            <ChatBubble 
              variant="sender" 
              message="Perfect! I'm going to hold onto my position then. Thanks for the analysis!" 
              sender={{
                name: "Jane Doe",
                timestamp: new Date()
              }}
              showAvatar={true}
            />
          </div>
        </Card>
      </section>
      
      {/* ChillRooms section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-poppins mb-4">Chill Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChillRoom
            variant="default"
            name="Bitcoin Traders"
            description="Discuss trading strategies and market trends"
            icon="ri-bitcoin-line"
            members={128}
            onlineMembers={[
              { name: "Alex" },
              { name: "Sarah" },
              { name: "Mike" },
              { name: "John" },
            ]}
          />
          
          <ChillRoom
            variant="active"
            name="NFT Collectors"
            description="Share and discuss your favorite NFT collections"
            icon="ri-image-line"
            members={85}
            unreadCount={3}
            onlineMembers={[
              { name: "Taylor" },
              { name: "Jordan" },
            ]}
          />
          
          <ChillRoom
            variant="crypto"
            name="DeFi Hub"
            description="All things decentralized finance"
            icon="ri-bank-line"
            members={212}
            onlineMembers={[
              { name: "Chris" },
              { name: "Emma" },
              { name: "David" },
            ]}
          />
          
          <ChillRoom
            variant="tech"
            name="Web3 Developers"
            description="Technical discussions about blockchain development"
            icon="ri-code-line"
            members={164}
            onlineMembers={[
              { name: "Lisa" },
              { name: "Mark" },
              { name: "Paul" },
              { name: "Anna" },
              { name: "Tom" },
            ]}
          />
          
          <ChillRoom
            variant="trending"
            name="Crypto News 📰"
            description="Breaking news and important updates"
            icon="ri-newspaper-line"
            members={347}
            isLive={true}
            onlineMembers={[
              { name: "James" },
              { name: "Sophie" },
              { name: "Robert" },
              { name: "Mia" },
            ]}
          />
        </div>
      </section>
      
      {/* Drops section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-poppins mb-4">Drops</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Drop
            variant="default"
            content="Just published a new article on Bitcoin's energy consumption compared to traditional banking. The results might surprise you!"
            user={{
              name: "Alex Johnson",
              username: "alexj",
            }}
            timestamp={new Date()}
            likes={24}
            comments={8}
            tags={["bitcoin", "energy", "research"]}
          />
          
          <Drop
            variant="crypto"
            content="Are we seeing the start of a new alt season? Ethereum and several other Layer 1s are showing strong momentum while Bitcoin dominance is declining."
            user={{
              name: "Crypto Kate",
              username: "cryptokate",
            }}
            timestamp={new Date()}
            likes={42}
            comments={16}
            tags={["altseason", "ethereum", "analysis"]}
          />
          
          <Drop
            variant="featured"
            content="I'm hosting a live Q&A session on NFT art and digital ownership tomorrow at 2 PM EST. Drop your questions below and join us!"
            user={{
              name: "Digital Artist",
              username: "digiartist",
            }}
            timestamp={new Date()}
            likes={86}
            comments={37}
            tags={["nft", "digitalart", "liveqa"]}
          />
          
          <Drop
            variant="ai"
            content="Our AI analysis predicts a potential market correction within the next 48 hours based on on-chain metrics, exchange flows, and sentiment indicators. Stay vigilant!"
            user={{
              name: "StayX AI",
              username: "stayx_ai",
            }}
            timestamp={new Date()}
            likes={134}
            comments={52}
            tags={["prediction", "marketanalysis", "onchaindata"]}
          />
        </div>
      </section>
    </Layout>
  );
};

export default UIShowcase;