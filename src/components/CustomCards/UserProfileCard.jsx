import React from "react";
import { Card } from "@/components/ui/card";

const UserProfileCard = ({ userName, greeting, profileImage }) => {
  return (
    <Card className="flex items-center p-6 bg-white shadow-lg rounded-lg">
      <img src={profileImage} alt={userName} className="w-16 h-16 rounded-full mr-4" />
      <div>
        <h2 className="text-xl font-bold">{userName}</h2>
        <p className="text-gray-500">{greeting}</p>
      </div>
    </Card>
  );
};

export default UserProfileCard;
