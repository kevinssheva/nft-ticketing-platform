import CreateEventForm from "@/components/CreateEventForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CreateEvent = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full mx-8 lg:mx-0 max-w-6xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create a New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEventForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
