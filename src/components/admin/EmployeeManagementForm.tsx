import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Employee } from "@/types/types";

interface Props {
  onAddEmployee: (employee: Omit<Employee, "id">) => void;
  onDeleteEmployee: (id: string) => void;
  employees: Employee[];
}

const EmployeeManagementForm = ({ onAddEmployee, onDeleteEmployee, employees }: Props) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEmployee(newEmployee);
    setNewEmployee({ name: "", email: "", password: "", role: "employee" });
    toast({
      title: "Success",
      description: `New ${newEmployee.role} added successfully`,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="animate-fade-in glass-card">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <Input
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={newEmployee.password}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, password: e.target.value })
              }
              required
            />
            <Select
              value={newEmployee.role}
              onValueChange={(value) =>
                setNewEmployee({ ...newEmployee, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full hover-scale">
              Add User
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="animate-fade-in glass-card">
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{employee.role}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteEmployee(employee.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
            {employees.length === 0 && (
              <p className="text-center text-gray-500">No users yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagementForm;