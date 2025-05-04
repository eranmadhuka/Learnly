import GroupChat from "../../components/chat/GroupChat";
import DashboardLayout from "../../components/layout/DashboardLayout";

const CommunitiesPage = ({ userId }) => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">
          Learning Communities
        </h1>
        <GroupChat userId={userId} />
      </div>
    </DashboardLayout>
  );
};

export default CommunitiesPage;
