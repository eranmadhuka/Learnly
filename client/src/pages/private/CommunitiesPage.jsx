import GroupChat from "../../components/chat/GroupChat";
import DashboardLayout from "../../components/layout/DashboardLayout";

const CommunitiesPage = ({ userId }) => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Learning Communities
        </h1>
        <div className="mb-6">
          <GroupChat userId={userId} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunitiesPage;
