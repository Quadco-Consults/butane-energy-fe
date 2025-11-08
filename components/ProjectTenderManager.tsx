"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Plus,
  Edit3,
  Check,
  X,
  Users,
  Building,
  Star,
  DollarSign,
  Calendar,
  Award,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectProcess } from "@/lib/types";

interface TenderDocument {
  id: string;
  title: string;
  type: 'specification' | 'drawings' | 'schedule' | 'terms' | 'other';
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  mandatory: boolean;
}

interface ContractorBid {
  id: string;
  contractorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  bidAmount: number;
  proposedDuration: number; // in days
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'selected';
  technicalScore: number;
  commercialScore: number;
  totalScore: number;
  documents: string[];
  notes: string;
  experience: string;
  previousProjects: string[];
}

interface ProjectTenderManagerProps {
  project: ProjectProcess;
  onTenderUpdate: (projectId: string, tenderData: any) => void;
  onBidEvaluation: (projectId: string, evaluationData: any) => void;
  onContractorSelection: (projectId: string, contractorData: any) => void;
}

export function ProjectTenderManager({
  project,
  onTenderUpdate,
  onBidEvaluation,
  onContractorSelection
}: ProjectTenderManagerProps) {
  const [tenderDocuments, setTenderDocuments] = useState<TenderDocument[]>([]);
  const [contractorBids, setContractorBids] = useState<ContractorBid[]>([]);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddBid, setShowAddBid] = useState(false);
  const [evaluatingBid, setEvaluatingBid] = useState<ContractorBid | null>(null);

  const [tenderDetails, setTenderDetails] = useState({
    title: "",
    description: "",
    scope: "",
    deliverables: "",
    timeline: "",
    qualificationCriteria: "",
    evaluationCriteria: "",
    submissionDeadline: "",
    technicalWeight: 60, // 60% technical, 40% commercial
    commercialWeight: 40
  });

  const [newDocument, setNewDocument] = useState({
    title: "",
    type: "specification" as const,
    description: "",
    mandatory: true
  });

  const [newBid, setNewBid] = useState({
    contractorName: "",
    contactPerson: "",
    email: "",
    phone: "",
    bidAmount: 0,
    proposedDuration: 0,
    experience: "",
    notes: ""
  });

  const [evaluation, setEvaluation] = useState({
    technicalCriteria: [
      { criterion: "Technical Expertise", weight: 20, score: 0 },
      { criterion: "Past Experience", weight: 20, score: 0 },
      { criterion: "Methodology", weight: 20, score: 0 },
      { criterion: "Team Qualifications", weight: 15, score: 0 },
      { criterion: "Quality Assurance", weight: 15, score: 0 },
      { criterion: "Health & Safety", weight: 10, score: 0 }
    ],
    commercialFactors: [
      { factor: "Bid Amount", weight: 60, score: 0 },
      { factor: "Payment Terms", weight: 20, score: 0 },
      { factor: "Timeline", weight: 20, score: 0 }
    ],
    overallComments: ""
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const addTenderDocument = () => {
    if (!newDocument.title || !newDocument.description) return;

    const document: TenderDocument = {
      id: `doc-${Date.now()}`,
      title: newDocument.title,
      type: newDocument.type,
      description: newDocument.description,
      uploadedBy: 'current-user',
      uploadedAt: new Date().toISOString(),
      fileSize: '2.5 MB', // Mock file size
      mandatory: newDocument.mandatory
    };

    setTenderDocuments([...tenderDocuments, document]);
    setNewDocument({ title: "", type: "specification", description: "", mandatory: true });
    setShowAddDocument(false);
  };

  const addContractorBid = () => {
    if (!newBid.contractorName || !newBid.contactPerson || !newBid.bidAmount) return;

    const bid: ContractorBid = {
      id: `bid-${Date.now()}`,
      contractorName: newBid.contractorName,
      contactPerson: newBid.contactPerson,
      email: newBid.email,
      phone: newBid.phone,
      bidAmount: newBid.bidAmount,
      proposedDuration: newBid.proposedDuration,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      technicalScore: 0,
      commercialScore: 0,
      totalScore: 0,
      documents: [],
      notes: newBid.notes,
      experience: newBid.experience,
      previousProjects: []
    };

    setContractorBids([...contractorBids, bid]);
    setNewBid({
      contractorName: "",
      contactPerson: "",
      email: "",
      phone: "",
      bidAmount: 0,
      proposedDuration: 0,
      experience: "",
      notes: ""
    });
    setShowAddBid(false);
  };

  const calculateBidScore = (bid: ContractorBid) => {
    const technicalScore = evaluation.technicalCriteria.reduce((sum, criterion) =>
      sum + (criterion.score * criterion.weight / 100), 0
    );
    const commercialScore = evaluation.commercialFactors.reduce((sum, factor) =>
      sum + (factor.score * factor.weight / 100), 0
    );

    const totalScore = (technicalScore * tenderDetails.technicalWeight / 100) +
                      (commercialScore * tenderDetails.commercialWeight / 100);

    return {
      technicalScore: Math.round(technicalScore),
      commercialScore: Math.round(commercialScore),
      totalScore: Math.round(totalScore)
    };
  };

  const evaluateBid = (bidId: string) => {
    const scores = calculateBidScore(contractorBids.find(b => b.id === bidId)!);

    setContractorBids(bids => bids.map(bid =>
      bid.id === bidId
        ? { ...bid, ...scores, status: 'under_review' as const }
        : bid
    ));

    setEvaluatingBid(null);
  };

  const shortlistBid = (bidId: string) => {
    setContractorBids(bids => bids.map(bid =>
      bid.id === bidId
        ? { ...bid, status: 'shortlisted' as const }
        : bid
    ));
  };

  const selectContractor = (bidId: string) => {
    const selectedBid = contractorBids.find(b => b.id === bidId);
    if (!selectedBid) return;

    // Update all bids - selected one gets 'selected', others get 'rejected'
    setContractorBids(bids => bids.map(bid =>
      bid.id === bidId
        ? { ...bid, status: 'selected' as const }
        : { ...bid, status: 'rejected' as const }
    ));

    // Update project with selected contractor
    onContractorSelection(project.id, {
      selectedContractor: selectedBid.contractorName,
      contractAmount: selectedBid.bidAmount,
      contractDuration: selectedBid.proposedDuration,
      contractorContact: selectedBid.contactPerson,
      selectionReason: evaluation.overallComments
    });
  };

  const publishTender = () => {
    onTenderUpdate(project.id, {
      tenderDetails,
      tenderDocuments,
      publishedAt: new Date().toISOString()
    });
  };

  const completeBidEvaluation = () => {
    const evaluatedBids = contractorBids.filter(bid => bid.status !== 'submitted');
    onBidEvaluation(project.id, {
      evaluatedBids,
      evaluationCriteria: evaluation,
      recommendedContractor: evaluatedBids.reduce((prev, current) =>
        prev.totalScore > current.totalScore ? prev : current
      )
    });
  };

  const getBidStatusColor = (status: ContractorBid['status']) => {
    const statusColors = {
      'submitted': 'bg-blue-500',
      'under_review': 'bg-yellow-500',
      'shortlisted': 'bg-green-500',
      'rejected': 'bg-red-500',
      'selected': 'bg-green-700'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getBidStatusLabel = (status: ContractorBid['status']) => {
    const statusLabels = {
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'shortlisted': 'Shortlisted',
      'rejected': 'Rejected',
      'selected': 'Selected'
    };
    return statusLabels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Tender Preparation Phase */}
      {project.status === 'tender_preparation' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Preparation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tender Title</Label>
                  <Input
                    value={tenderDetails.title}
                    onChange={(e) => setTenderDetails(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Project tender title"
                  />
                </div>
                <div>
                  <Label>Submission Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={tenderDetails.submissionDeadline}
                    onChange={(e) => setTenderDetails(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Tender Description</Label>
                <Textarea
                  value={tenderDetails.description}
                  onChange={(e) => setTenderDetails(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the tender"
                  rows={3}
                />
              </div>

              <div>
                <Label>Scope of Work</Label>
                <Textarea
                  value={tenderDetails.scope}
                  onChange={(e) => setTenderDetails(prev => ({ ...prev, scope: e.target.value }))}
                  placeholder="Define the scope of work for contractors"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Technical Weight (%)</Label>
                  <Input
                    type="number"
                    value={tenderDetails.technicalWeight}
                    onChange={(e) => {
                      const technical = parseInt(e.target.value) || 0;
                      setTenderDetails(prev => ({
                        ...prev,
                        technicalWeight: technical,
                        commercialWeight: 100 - technical
                      }));
                    }}
                  />
                </div>
                <div>
                  <Label>Commercial Weight (%)</Label>
                  <Input
                    type="number"
                    value={tenderDetails.commercialWeight}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tender Documents</CardTitle>
              <Dialog open={showAddDocument} onOpenChange={setShowAddDocument}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Tender Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Document Title</Label>
                      <Input
                        value={newDocument.title}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Document title"
                      />
                    </div>
                    <div>
                      <Label>Document Type</Label>
                      <Select
                        value={newDocument.type}
                        onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="specification">Technical Specification</SelectItem>
                          <SelectItem value="drawings">Drawings & Plans</SelectItem>
                          <SelectItem value="schedule">Project Schedule</SelectItem>
                          <SelectItem value="terms">Terms & Conditions</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newDocument.description}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Document description"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newDocument.mandatory}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, mandatory: e.target.checked }))}
                        className="rounded"
                      />
                      <Label>Mandatory document for submission</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddDocument(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addTenderDocument}>
                        Add Document
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenderDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {doc.type}
                          </Badge>
                          {doc.mandatory && (
                            <Badge variant="destructive" className="text-xs">
                              Mandatory
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{doc.fileSize}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {tenderDocuments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>No tender documents added yet.</p>
                    <p className="text-sm">Add documents that contractors need for their bids.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Tender
            </Button>
            <Button onClick={publishTender} disabled={!tenderDetails.title || tenderDocuments.length === 0}>
              Publish Tender
            </Button>
          </div>
        </div>
      )}

      {/* Tender Publication Phase */}
      {project.status === 'tender_publication' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Manage Contractor Bids</CardTitle>
              <Dialog open={showAddBid} onOpenChange={setShowAddBid}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Bid (Mock)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Contractor Bid</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Contractor Name</Label>
                      <Input
                        value={newBid.contractorName}
                        onChange={(e) => setNewBid(prev => ({ ...prev, contractorName: e.target.value }))}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label>Contact Person</Label>
                      <Input
                        value={newBid.contactPerson}
                        onChange={(e) => setNewBid(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Primary contact"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newBid.email}
                          onChange={(e) => setNewBid(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="contact@company.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={newBid.phone}
                          onChange={(e) => setNewBid(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+234..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Bid Amount (₦)</Label>
                        <Input
                          type="number"
                          value={newBid.bidAmount}
                          onChange={(e) => setNewBid(prev => ({ ...prev, bidAmount: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label>Duration (Days)</Label>
                        <Input
                          type="number"
                          value={newBid.proposedDuration}
                          onChange={(e) => setNewBid(prev => ({ ...prev, proposedDuration: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Experience Summary</Label>
                      <Textarea
                        value={newBid.experience}
                        onChange={(e) => setNewBid(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="Brief summary of relevant experience"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddBid(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addContractorBid}>
                        Add Bid
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractorBids.map((bid) => (
                  <div key={bid.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{bid.contractorName}</h4>
                        <p className="text-sm text-muted-foreground">{bid.contactPerson} • {bid.email}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-white", getBidStatusColor(bid.status))}>
                        {getBidStatusLabel(bid.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bid Amount:</span>
                        <p className="font-medium">{formatCurrency(bid.bidAmount)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{bid.proposedDuration} days</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Technical Score:</span>
                        <p className="font-medium">{bid.technicalScore || '-'}/100</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Score:</span>
                        <p className="font-medium">{bid.totalScore || '-'}/100</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEvaluatingBid(bid)}
                        disabled={bid.status === 'rejected'}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Evaluate
                      </Button>
                      {bid.status === 'under_review' && (
                        <Button
                          size="sm"
                          onClick={() => shortlistBid(bid.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Shortlist
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {contractorBids.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4" />
                    <p>No contractor bids received yet.</p>
                    <p className="text-sm">Bids will appear here as contractors submit their proposals.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {contractorBids.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={completeBidEvaluation}>
                Proceed to Bid Evaluation
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Bid Evaluation Dialog */}
      {evaluatingBid && (
        <Dialog open={!!evaluatingBid} onOpenChange={() => setEvaluatingBid(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Evaluate Bid - {evaluatingBid.contractorName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Technical Evaluation (Weight: {tenderDetails.technicalWeight}%)</h4>
                <div className="space-y-3">
                  {evaluation.technicalCriteria.map((criterion, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm">{criterion.criterion}</span>
                      <span className="text-sm text-muted-foreground">Weight: {criterion.weight}%</span>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={criterion.score}
                        onChange={(e) => setEvaluation(prev => ({
                          ...prev,
                          technicalCriteria: prev.technicalCriteria.map((c, i) =>
                            i === index ? { ...c, score: parseInt(e.target.value) || 0 } : c
                          )
                        }))}
                        placeholder="Score (0-100)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Commercial Evaluation (Weight: {tenderDetails.commercialWeight}%)</h4>
                <div className="space-y-3">
                  {evaluation.commercialFactors.map((factor, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm">{factor.factor}</span>
                      <span className="text-sm text-muted-foreground">Weight: {factor.weight}%</span>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={factor.score}
                        onChange={(e) => setEvaluation(prev => ({
                          ...prev,
                          commercialFactors: prev.commercialFactors.map((f, i) =>
                            i === index ? { ...f, score: parseInt(e.target.value) || 0 } : f
                          )
                        }))}
                        placeholder="Score (0-100)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Overall Comments</Label>
                <Textarea
                  value={evaluation.overallComments}
                  onChange={(e) => setEvaluation(prev => ({ ...prev, overallComments: e.target.value }))}
                  placeholder="Overall evaluation comments and recommendations"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEvaluatingBid(null)}>
                  Cancel
                </Button>
                <Button onClick={() => evaluateBid(evaluatingBid.id)}>
                  Save Evaluation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Contractor Selection Phase */}
      {project.status === 'contractor_selection' && (
        <Card>
          <CardHeader>
            <CardTitle>Contractor Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractorBids
                .filter(bid => bid.status === 'shortlisted')
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((bid, index) => (
                  <div key={bid.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{bid.contractorName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(bid.bidAmount)} • {bid.proposedDuration} days • Score: {bid.totalScore}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectContractor(bid.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

              {contractorBids.filter(bid => bid.status === 'shortlisted').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>No contractors shortlisted yet.</p>
                  <p className="text-sm">Complete bid evaluation first to see shortlisted contractors.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}