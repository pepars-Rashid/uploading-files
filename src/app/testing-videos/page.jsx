// src/app/testing-images-store/page.jsx 
import VideoForm from '@/components/video-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/database/db';
import { Video } from '@/database/schema';

export const dynamic = 'force-dynamic'

export default async function Page() {
  // Fetch videos
  const result = await db.select().from(Video);

  console.log('result:', result);

  return (
    <div className="container mx-auto p-4">
      {/* video Form */}
      <div className="mb-8">
        <VideoForm />
      </div>

      {/* Display Vides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              {video.pstu?.path && (
                <div className="relative h-fit w-full mb-4">
                  <video
                    controls
                    width="100%"
                    className="object-cover rounded-lg"
                  >
                    <source src={video.pstu.path} type="video/mp4"/>
                  </video>
                </div>
              )}
              <CardTitle>{video.name}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Category: {video.category}</p>
              <p className="text-sm text-gray-600">
                Uploaded: {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}