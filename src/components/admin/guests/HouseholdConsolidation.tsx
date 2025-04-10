
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHouseholdConsolidation } from "../hooks/useHouseholdConsolidation";
import { Home, AlertTriangle, RefreshCw, Check } from "lucide-react";

interface HouseholdConsolidationProps {
  onSuccess: () => void;
}

export const HouseholdConsolidation: React.FC<HouseholdConsolidationProps> = ({ onSuccess }) => {
  const [showDuplicates, setShowDuplicates] = useState(false);

  const {
    isConsolidating,
    duplicateGroups,
    isLoading,
    findDuplicateHouseholds,
    consolidateHouseholds
  } = useHouseholdConsolidation(onSuccess);

  const handleScanForDuplicates = async () => {
    const hasDuplicates = await findDuplicateHouseholds();
    setShowDuplicates(hasDuplicates);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Household Management
        </CardTitle>
        <CardDescription>
          Scan and consolidate duplicate household records
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!showDuplicates ? (
          <div className="text-center py-2">
            <Button 
              onClick={handleScanForDuplicates} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Scan for Duplicate Households
                </>
              )}
            </Button>
          </div>
        ) : duplicateGroups.length > 0 ? (
          <div className="space-y-4">
            <p className="text-amber-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Found {duplicateGroups.length} groups of duplicate households
            </p>
            
            <div className="border rounded-md p-4 space-y-4">
              {duplicateGroups.map((group, idx) => (
                <div key={idx} className="pb-3 border-b last:border-0 last:pb-0">
                  <h4 className="font-medium mb-2">"{group.households[0].name}" duplicates:</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    {group.households.map((h, i) => (
                      <li key={h.id} className={i === 0 ? "font-medium" : ""}>
                        {h.name} {i === 0 && "(will keep this one)"} {i !== 0 && "(will be removed)"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-green-600 flex flex-col items-center gap-2">
            <Check className="h-8 w-8" />
            <p>No duplicate households found!</p>
          </div>
        )}
      </CardContent>
      
      {duplicateGroups.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setShowDuplicates(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={consolidateHouseholds}
            disabled={isConsolidating}
          >
            {isConsolidating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Consolidating...
              </>
            ) : (
              "Consolidate Households"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
