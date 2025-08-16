import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Target, AlertTriangle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ExpenseChart from '@/components/charts/ExpenseChart';
import heroImage from '@/assets/financial-hero.jpg';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend, className = '' }) => {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted-foreground';
  
  return (
    <Card className={`hover:shadow-lg transition-smooth ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColor}`}>{description}</p>
      </CardContent>
    </Card>
  );
};

const HomeView: React.FC = () => {
  const [mockData] = useState({
    totalBudgets: 25000,
    currentExpenses: 18750,
    totalGoals: 50000,
    currentSavings: 12500,
    monthlyIncome: 30000,
    expensesByCategory: [
    { category: 'Food', amount: 5000, color: '#10b981' },
      { category: 'Transportation', amount: 3500, color: '#3b82f6' },
      { category: 'Entertainment', amount: 2800, color: '#f59e0b' },
      { category: 'Utilities', amount: 4200, color: '#ef4444' },
      { category: 'Shopping', amount: 3250, color: '#8b5cf6' }
    ]
  });

  const budgetUsedPercentage = (mockData.currentExpenses / mockData.totalBudgets) * 100;
  const savingsProgress = (mockData.currentSavings / mockData.totalGoals) * 100;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-gradient-hero p-8 text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(59, 130, 246, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to CashCare!</h1>
          <p className="text-white/90 mb-6">Take control of your finances and achieve your financial goals</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="lg">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Wallet className="h-4 w-4" />
              New Budget
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Target className="h-4 w-4" />
              New Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Budgets"
          value={`$${mockData.totalBudgets.toLocaleString()}`}
          description={`${budgetUsedPercentage.toFixed(1)}% used`}
          icon={<Wallet className="h-4 w-4 text-primary" />}
          trend={budgetUsedPercentage > 80 ? 'down' : 'up'}
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${mockData.currentExpenses.toLocaleString()}`}
          description="vs previous month"
          icon={<TrendingDown className="h-4 w-4 text-danger" />}
          trend="down"
        />
        <StatCard
          title="Monthly Income"
          value={`$${mockData.monthlyIncome.toLocaleString()}`}
          description="+12% vs previous month"
          icon={<TrendingUp className="h-4 w-4 text-success" />}
          trend="up"
        />
        <StatCard
          title="Goal Progress"
          value={`${savingsProgress.toFixed(1)}%`}
          description={`$${mockData.currentSavings.toLocaleString()} saved`}
          icon={<Target className="h-4 w-4 text-secondary" />}
          trend="up"
        />
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Important Alerts</h2>
        <div className="space-y-3">
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              <strong>Warning:</strong> You've spent 85% of your "Food" budget
            </AlertDescription>
          </Alert>
          <Alert className="border-success bg-success/10">
            <Target className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              <strong>Congratulations!</strong> You're close to reaching your "Vacation 2025" goal
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Charts and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Expenses by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart data={mockData.expensesByCategory} />
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Current status of your budgets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Budget</span>
                <span className="font-medium">${mockData.totalBudgets.toLocaleString()}</span>
              </div>
              <Progress value={budgetUsedPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spent: ${mockData.currentExpenses.toLocaleString()}</span>
                <span>{budgetUsedPercentage.toFixed(1)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Savings Goal</span>
                <span className="font-medium">${mockData.totalGoals.toLocaleString()}</span>
              </div>
              <Progress value={savingsProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Saved: ${mockData.currentSavings.toLocaleString()}</span>
                <span>{savingsProgress.toFixed(1)}%</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Monthly balance:</span>
                  <span className="font-semibold text-success">
                    +${(mockData.monthlyIncome - mockData.currentExpenses).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeView;