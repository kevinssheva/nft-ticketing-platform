import ListEventsContainer from '@/components/ListEventsContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Event = () => {
  return (
    <div className="flex min-h-screen items-start my-8 justify-center bg-gray-50">
      <Card className="w-full h-full mx-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ListEventsContainer />
        </CardContent>
      </Card>
    </div>
  );
};

export default Event;
