import React, { useState } from 'react';
import { Plus, Edit, Trash2, Wallet, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Budget {
  id: string;
  name: string;
  totalAmount: number;
  period: 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  status: 'active' | 'closed';
  categories: BudgetCategory[];
}

interface BudgetCategory {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  limitAmount: number;
  spentAmount: number;
}

const BudgetsView: React.FC = () => {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'January 2025 Budget',
      totalAmount: 25000,
      period: 'monthly',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      status: 'active',
      categories: [
        { categoryId: '2', categoryName: 'Food', categoryColor: '#ef4444', limitAmount: 6000, spentAmount: 5100 },
        { categoryId: '3', categoryName: 'Transportation', categoryColor: '#3b82f6', limitAmount: 4000, spentAmount: 3500 },
        { categoryId: '4', categoryName: 'Entertainment', categoryColor: '#f59e0b', limitAmount: 3000, spentAmount: 2800 },
      ]
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'custom',
    startDate: '',
    endDate: ''
  });

  // Mock categories
  const availableCategories = [
    { id: '2', name: 'Food', color: '#ef4444' },
    { id: '3', name: 'Transportation', color: '#3b82f6' },
    { id: '4', name: 'Entertainment', color: '#f59e0b' },
    { id: '5', name: 'Utilities', color: '#8b5cf6' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.totalAmount) {
      toast({
        title: "Error",
        description: "Complete all required fields",
        variant: "destructive"
      });
      return;
    }

    const budgetData = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      id: editingBudget?.id || Date.now().toString(),
      status: 'active' as const,
      categories: editingBudget?.categories || []
    };

    if (editingBudget) {
      setBudgets(prev => prev.map(budget => 
        budget.id === editingBudget.id ? { ...budget, ...budgetData } : budget
      ));
      toast({
        title: "Budget updated",
        description: "The budget has been updated successfully"
      });
    } else {
      setBudgets(prev => [...prev, budgetData as Budget]);
      toast({
        title: "Budget created",
        description: "The new budget has been created successfully"
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      totalAmount: '',
      period: 'monthly',
      startDate: '',
      endDate: ''
    });
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      totalAmount: budget.totalAmount.toString(),
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate
    });
    setIsDialogOpen(true);
  };

  const closeBudget = (budgetId: string) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId ? { ...budget, status: 'closed' } : budget
    ));
    toast({
      title: "Budget closed",
      description: "The budget has been closed successfully"
    });
  };

  const getBudgetProgress = (budget: Budget) => {
    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
    return (totalSpent / budget.totalAmount) * 100;
  };

  const getCategoryProgress = (category: BudgetCategory) => {
    return (category.spentAmount / category.limitAmount) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            Budgets
          </h1>
          <p className="text-muted-foreground">Manage your budgets and control your expenses</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg">
              <Plus className="h-4 w-4" />
              New Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'New Budget'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget 
                  ? 'Modify the budget data' 
                  : 'Create a new budget to control your expenses'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Budget name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. January 2025 Budget"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                  placeholder="25000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={formData.period} onValueChange={(value: 'weekly' | 'monthly' | 'custom') => setFormData({...formData, period: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingBudget ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budgets List */}
      <div className="grid grid-cols-1 gap-6">
        {budgets.map((budget) => {
          const progress = getBudgetProgress(budget);
          const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
          
          return (
            <Card key={budget.id} className="hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {budget.name}
                      {budget.status === 'active' ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                          Closed
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                      </span>
                      <span className="capitalize">{budget.period}</span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {budget.status === 'active' && (
                      <Button variant="outline" size="sm" onClick={() => closeBudget(budget.id)}>
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">
                      ${totalSpent.toLocaleString()} / ${budget.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(1)}% used</span>
                    <span>Remaining: ${(budget.totalAmount - totalSpent).toLocaleString()}</span>
                  </div>
                </div>

                {/* Categories Progress */}
                {budget.categories.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Categories</h4>
                    {budget.categories.map((category) => {
                      const categoryProgress = getCategoryProgress(category);
                      const isNearLimit = categoryProgress >= 80;
                      const isOverLimit = categoryProgress > 100;
                      
                      return (
                        <div key={category.categoryId} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.categoryColor }}
                              />
                              <span>{category.categoryName}</span>
                              {isNearLimit && (
                                <AlertTriangle className="h-4 w-4 text-warning" />
                              )}
                            </div>
                            <span className="font-medium">
                              ${category.spentAmount.toLocaleString()} / ${category.limitAmount.toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(categoryProgress, 100)} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs">
                            <span className={isOverLimit ? 'text-danger' : isNearLimit ? 'text-warning' : 'text-muted-foreground'}>
                              {categoryProgress.toFixed(1)}% used
                            </span>
                            <span className="text-muted-foreground">
                              Remaining: ${Math.max(0, category.limitAmount - category.spentAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No budgets</h3>
            <p className="text-muted-foreground mb-4">
              Create your first budget to start controlling your expenses
            </p>
            <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create first budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetsView;