'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchAllProjects } from '@/features/projectSlice';
import {
  fetchBugByProjectId,
  resolveBug,
  clearErrors,
} from '@/features/bugSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const statusClasses = {
  planned: 'bg-red-200 text-red-800',
  'in progress': 'bg-blue-200 text-blue-800',
  completed: 'bg-green-200 text-green-800',
};

const priorityStyles = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-red-100 text-red-800 border-red-200',
  Critical: 'bg-red-200 text-red-900 border-red-300',
};

const statusStyles = {
  Open: 'bg-red-100 text-red-800 border-red-200',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Resolved: 'bg-green-100 text-green-800 border-green-200',
  Closed: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function AllIssuesList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector((state) => state.project.projects || []);
  const fetchProjectsStatus = useSelector((state) => state.project.status.fetchAllProjects);
  const projectsError = useSelector((state) => state.project.error.fetchAllProjects);
  const bugsLoading = useSelector((state) => state.bugs.loading.bugsByProjectId);
  const bugsError = useSelector((state) => state.bugs.error.bugsByProjectId);

  const [allBugs, setAllBugs] = useState([]);
  const [isLoadingBugs, setIsLoadingBugs] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedProjectName, setSelectedProjectName] = useState('All Projects');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBug, setSelectedBug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 5 : 10
  );

  useEffect(() => {
    if (fetchProjectsStatus === 'idle') {
      dispatch(fetchAllProjects()).then((result) => {
        if (result.error) {
          toast.error(`Failed to fetch projects: ${result.error.message}`);
        }
      });
    }
  }, [dispatch, fetchProjectsStatus]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (projects.length > 0 && allBugs.length === 0) {
      const fetchAllBugs = async () => {
        setIsLoadingBugs(true);
        let tempBugs = [];
        for (const p of projects) {
          const result = await dispatch(fetchBugByProjectId(p.projectId));
          if (result.error) {
            toast.error(`Failed to fetch bugs for ${p.projectName}: ${result.error.message}`);
          } else {
            const bugsWithProject = (result.payload || []).map((bug) => ({
              ...bug,
              projectId: p.projectId,
              projectName: p.projectName,
            }));
            tempBugs = [...tempBugs, ...bugsWithProject];
          }
        }
        setAllBugs(tempBugs);
        setIsLoadingBugs(false);
      };
      fetchAllBugs();
    }
  }, [projects, dispatch, allBugs.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedProjectId]);

  const currentBugs = selectedProjectId === 'all'
    ? allBugs
    : allBugs.filter((b) => b.projectId === selectedProjectId);

  const bugStats = {
    total: currentBugs.length,
    open: currentBugs.filter((bug) => bug.status?.toLowerCase() === 'open').length,
    resolved: currentBugs.filter((bug) => bug.status?.toLowerCase() === 'resolved').length,
  };

  const filteredAndSortedBugs = () => {
    let filtered = currentBugs;
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((bug) => bug.status?.toLowerCase() === selectedStatus);
    }
    return filtered;
  };

  const sortedBugs = filteredAndSortedBugs();
  const totalItems = sortedBugs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastBug = currentPage * itemsPerPage;
  const indexOfFirstBug = indexOfLastBug - itemsPerPage;
  const currentBugsPage = sortedBugs.slice(indexOfFirstBug, indexOfLastBug);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (bug) => {
    setSelectedBug(bug);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBug(null);
  };

  const handleResolveBug = (bugId) => {
    dispatch(resolveBug(bugId)).then((result) => {
      if (result.error) {
        toast.error(`Failed to resolve bug: ${result.error.message}`);
      } else {
        toast.success('Bug resolved successfully!');
        // Update allBugs to reflect the change
        setAllBugs((prev) =>
          prev.map((b) => (b.bug_id === bugId ? { ...b, status: 'Resolved' } : b))
        );
        handleModalClose();
      }
    });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedStatus('all');
    setSelectedProjectId('all');
    setSelectedProjectName('All Projects');
    setProjectSearch('');
    setCurrentPage(1);
  };

  // Loading state
  if (fetchProjectsStatus === 'loading' || isLoadingBugs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white">
        <Skeleton className="h-12 w-full max-w-4xl rounded-lg" />
      </div>
    );
  }

  // Error state
  if (projectsError || bugsError) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg border min-h-[calc(100vh-4rem)]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading data</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{projectsError || bugsError}</p>
      </div>
    );
  }

  // Empty state
  if (allBugs.length === 0) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg border min-h-[calc(100vh-4rem)]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No bugs found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          No bugs are available.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={0}>
      <div className="w-full bg-white">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header and Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="flex items-center gap-2">Reported Issues :</span>
              <span className="text-bold font-medium text-blue-700">{selectedProjectName}</span>
            </h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg h-[38px] text-sm flex items-center justify-center"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white shadow-lg border-gray-200 rounded-lg">
                  <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                  <div className="p-2">
                    <Input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value.toLowerCase())}
                      placeholder="Search project..."
                      className="text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                  <DropdownMenuItem onClick={() => {
                    setSelectedProjectId('all');
                    setSelectedProjectName('All Projects');
                    setProjectSearch('');
                  }}>
                    <div className="flex justify-between w-full">
                      <span>All Projects</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {allBugs.length}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  {projects
                    .filter((p) => p.projectName?.toLowerCase().includes(projectSearch))
                    .map((p) => (
                      <DropdownMenuItem
                        key={p.projectId}
                        onClick={() => {
                          setSelectedProjectId(p.projectId);
                          setSelectedProjectName(p.projectName);
                          setProjectSearch('');
                        }}
                      >
                        <div className="flex justify-between w-full">
                          <span>{p.projectName}</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {allBugs.filter((b) => b.projectId === p.projectId).length}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Bugs</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{bugStats.total}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('open')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-red-500">●</span>
                        Open
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{bugStats.open}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('resolved')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-green-500">●</span>
                        Resolved
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{bugStats.resolved}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="justify-center text-sm">
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Bugs Table */}
          {currentBugsPage.length === 0 ? (
            <div className="bg-white rounded-lg border text-center p-6 min-h-[calc(100vh-4rem)]">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bugs found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No bugs match your current filters. Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2 mx-auto bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg text-sm"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm">
                    <TableHead className="font-bold text-white text-center">SL. No</TableHead>
                    {selectedProjectId === 'all' && (
                      <TableHead className="font-bold text-white text-center w-[200px]">Project</TableHead>
                    )}
                    <TableHead className="font-bold text-white text-center">Bug Id</TableHead>
                    <TableHead className="font-bold text-white text-center">Task Id</TableHead>
                    <TableHead className="font-bold text-white text-center">Priority</TableHead>
                    <TableHead className="font-bold text-white text-center">Status</TableHead>
                    <TableHead className="font-bold text-white text-center">Created At</TableHead>
                    <TableHead className="font-bold text-white text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBugsPage.map((bug, index) => (
                    <TableRow key={bug._id} className="text-xs sm:text-sm">
                      <TableCell className="text-center">{indexOfFirstBug + index + 1}</TableCell>
                      {selectedProjectId === 'all' && (
                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="line-clamp-1">{bug.projectName || 'N/A'}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{bug.projectName || 'N/A'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      )}
                      <TableCell className="text-center">{bug.bug_id || 'N/A'}</TableCell>
                      <TableCell className="text-center">{bug.taskRef || 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                            priorityStyles[bug.priority] || 'bg-gray-200 text-gray-800'
                          )}
                        >
                          {bug.priority || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                            statusStyles[bug.status] || 'bg-gray-200 text-gray-800'
                          )}
                        >
                          {bug.status || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {bug.createdAt
                          ? new Date(bug.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-center">
                        <button className="cursor-pointer" onClick={() => handleViewClick(bug)}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} bugs
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-sm"
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            'w-8 h-8 p-0',
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white text-black border-gray-300 hover:bg-gray-100',
                            'rounded-lg text-xs sm:text-sm'
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bug Details Dialog */}
        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Bug Details</DialogTitle>
            </DialogHeader>
            {selectedBug && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Bug ID</label>
                  <p className="text-muted-foreground">{selectedBug.bug_id || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <p className="text-muted-foreground">{selectedBug.description || 'N/A'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Title</label>
                  <p className="text-muted-foreground">{selectedBug.title || 'No description provided'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Task Ref</label>
                  <p className="text-muted-foreground">{selectedBug.taskRef || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Assigned To</label>
                  <p className="text-muted-foreground">
                    {selectedBug.assignedToDetails?.memberName || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Priority</label>
                  <p>
                    <Badge
                      className={`${
                        priorityStyles[selectedBug.priority] || 'bg-gray-100 text-gray-800 border-gray-200'
                      } border`}
                    >
                      {selectedBug.priority || 'N/A'}
                    </Badge>
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p>
                    <Badge
                      className={`${
                        statusStyles[selectedBug.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                      } border capitalize`}
                    >
                      {selectedBug.status || 'N/A'}
                    </Badge>
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Deadline</label>
                  <p className="text-muted-foreground">
                    {selectedBug.deadline
                      ? new Date(selectedBug.deadline).toLocaleDateString('en-IN')
                      : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Created At</label>
                  <p className="text-muted-foreground">
                    {selectedBug.createdAt
                      ? new Date(selectedBug.createdAt).toLocaleDateString('en-IN')
                      : 'N/A'}
                  </p>
                </div>
                {selectedBug.resolvedAt && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Resolved At</label>
                    <p className="text-muted-foreground">
                      {new Date(selectedBug.resolvedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* <div className="flex justify-end gap-2">
              {selectedBug?.status?.toLowerCase() !== 'resolved' && (
                <Button
                  onClick={() => handleResolveBug(selectedBug.bug_id)}
                  className="bg-blue-700 hover:bg-blue-700 text-white"
                  disabled={bugsLoading}
                >
                  {bugsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    'Resolve Bug'
                  )}
                </Button>
              )}
            </div> */}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}