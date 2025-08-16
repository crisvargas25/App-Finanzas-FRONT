import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'in_progress' | 'completed' | 'overdue';
  createdAt: string;
}

const GoalsView: React.FC = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Europe Vacation',
      targetAmount: 50000,
      currentAmount: 12500,
      deadline: '2025-06-15',
      status: 'in_progress',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      name: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 75000,
      deadline: '2025-12-31',
      status: 'in_progress',
      createdAt: '2024-12-01'
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 25000,
      currentAmount: 25000,
      deadline: '2025-01-31',
      status: 'completed',
      createdAt: '2024-11-15'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.targetAmount || !formData.deadline) {
      toast({
        title: "Error",
        description: "Complete all required fields",
        variant: "destructive"
      });
      return;
    }

    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      id: editingGoal?.id || Date.now().toString(),
      currentAmount: editingGoal?.currentAmount || 0,
      status: 'in_progress' as const,
      createdAt: editingGoal?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingGoal) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal.id ? { ...goal, ...goalData } : goal
      ));
      toast({
        title: "Goal updated",
        description: "The goal has been updated successfully"
      });
    } else {
      setGoals(prev => [...prev, goalData as Goal]);
      toast({
        title: "Goal created",
        description: "The new goal has been created successfully"
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contributingGoal || !contributeAmount) {
      toast({
        title: "Error",
        description: "Enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(contributeAmount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than zero",
        variant: "destructive"
      });
      return;
    }

    setGoals(prev => prev.map(goal => {
      if (goal.id === contributingGoal.id) {
        const newAmount = goal.currentAmount + amount;
        const status = newAmount >= goal.targetAmount ? 'completed' : goal.status;
        return { ...goal, currentAmount: newAmount, status };
      }
      return goal;
    }));

    toast({
      title: "Contribution recorded",
      description: `$${amount.toLocaleString()} has been added to your goal`
    });

    setContributeAmount('');
    setContributingGoal(null);
    setIsContributeDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      deadline: ''
    });
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "The goal has been deleted successfully"
    });
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (goal: Goal) => {
    const daysRemaining = getDaysRemaining(goal.deadline);
    
    if (goal.status === 'completed') {
      return <span className="px-2 py-1 text-xs bg-success/10 text-success rounded-full">Completed</span>;
    }
    
    if (daysRemaining < 0) {
      return <span className="px-2 py-1 text-xs bg-danger/10 text-danger rounded-full">Overdue</span>;
    }
    
    if (daysRemaining <= 7) {
      return <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full">Due soon</span>;
    }
    
    return <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">In progress</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Savings Goals
          </h1>
          <p className="text-muted-foreground">Define and achieve your financial objectives</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Edit Goal' : 'New Goal'}
              </DialogTitle>
              <DialogDescription>
                {editingGoal 
                  ? 'Modify the goal data' 
                  : 'Create a new savings goal'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Europe Vacation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="50000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingGoal ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contribute Dialog */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
            <DialogDescription>
              Add money to your goal: {contributingGoal?.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContribute} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contributeAmount">Amount to contribute</Label>
              <Input
                id="contributeAmount"
                type="number"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Contribution
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsContributeDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const isCompleted = goal.status === 'completed';
          const isOverdue = daysRemaining < 0 && !isCompleted;
          
          return (
            <Card key={goal.id} className="hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(goal)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete goal?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the goal "{goal.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(goal.id)} className="bg-danger text-danger-foreground hover:bg-danger/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${goal.currentAmount.toLocaleString()}</span>
                    <span>${goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Time remaining */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {isCompleted 
                      ? 'Goal completed' 
                      : isOverdue 
                        ? `Overdue by ${Math.abs(daysRemaining)} days`
                        : daysRemaining === 0
                          ? 'Due today'
                          : daysRemaining === 1
                            ? 'Due tomorrow'
                            : `${daysRemaining} days remaining`
                    }
                  </span>
                </div>

                {/* Amount remaining */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
                    </span>
                  </div>
                )}

                {/* Action Button */}
                {!isCompleted && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      setContributingGoal(goal);
                      setIsContributeDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Contribution
                  </Button>
                )}

                {isCompleted && (
                  <div className="text-center p-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                    Goal completed! 🎉
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals</h3>
            <p className="text-muted-foreground mb-4">
              Create your first savings goal to start achieving your objectives
            </p>
            <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create first goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsView;