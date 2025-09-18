import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp, MapPin, Clock } from 'lucide-react';

const mockQuestions = [
  {
    id: 1,
    user: 'Sarah Johnson',
    question: 'What are the best restaurants near the Louvre Museum?',
    time: '1 hour ago',
    answers: 3,
    likes: 7,
    category: 'Food'
  },
  {
    id: 2,
    user: 'Mike Chen',
    question: 'Is it safe to walk around Montmartre at night?',
    time: '3 hours ago',
    answers: 5,
    likes: 12,
    category: 'Safety'
  },
  {
    id: 3,
    user: 'Emma Wilson',
    question: 'Best metro route from Charles de Gaulle Airport to city center?',
    time: '5 hours ago',
    answers: 8,
    likes: 15,
    category: 'Transportation'
  }
];

const mockAnswers = [
  {
    id: 1,
    questionId: 1,
    user: 'Local Guide Pierre',
    answer: 'I recommend Café Marly inside the Louvre - great views and food. For budget options, try the nearby Rue de Rivoli area.',
    time: '45 minutes ago',
    likes: 5,
    isLocal: true
  },
  {
    id: 2,
    questionId: 1,
    user: 'Tourist Lisa',
    answer: 'We loved L\'Ambassade d\'Auvergne! Traditional French cuisine and very close to the museum.',
    time: '30 minutes ago',
    likes: 2,
    isLocal: false
  }
];

export const LocalGuideQA = () => {
  const [showAskForm, setShowAskForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    category: 'General'
  });

  const categories = ['General', 'Food', 'Safety', 'Transportation', 'Attractions', 'Shopping'];

  const handleAskQuestion = () => {
    if (newQuestion.question.trim()) {
      console.log('Asking question:', newQuestion);
      setNewQuestion({ question: '', category: 'General' });
      setShowAskForm(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Local Guides Q&A</h2>
        <Button 
          onClick={() => setShowAskForm(!showAskForm)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Ask Question
        </Button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ask the Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What would you like to know about the area?"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={newQuestion.category === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewQuestion({ ...newQuestion, category })}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAskQuestion}>Ask Question</Button>
              <Button variant="outline" onClick={() => setShowAskForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {mockQuestions.map((question) => (
          <Card key={question.id} className="cursor-pointer hover:shadow-soft transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{question.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {question.category}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-lg mb-2">{question.question}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{question.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{question.answers} answers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{question.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show answers if question is selected */}
              {selectedQuestion === question.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {mockAnswers
                    .filter(answer => answer.questionId === question.id)
                    .map((answer) => (
                      <div key={answer.id} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{answer.user}</span>
                          {answer.isLocal && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success">
                              Local Guide
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{answer.time}</span>
                        </div>
                        <p className="mb-2">{answer.answer}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{answer.likes} likes</span>
                        </div>
                      </div>
                    ))
                  }
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedQuestion(null)}
                  >
                    Hide Answers
                  </Button>
                </div>
              )}

              {selectedQuestion !== question.id && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedQuestion(question.id)}
                  className="mt-2"
                >
                  View {question.answers} Answers
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};