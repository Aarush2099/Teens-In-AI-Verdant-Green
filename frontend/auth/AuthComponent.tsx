"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface FormData {
  projectName: string
  projectType: string
  approximateArea: string
  location: string
  isPublic: boolean
}

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    projectType: "",
    approximateArea: "",
    location: "",
    isPublic: true,
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const projectTypes = [
    "Community Garden",
    "Urban Forest",
    "Rooftop Garden",
    "Wetland Restoration",
    "Grassland Conservation",
    "Agroforestry",
    "Reforestation",
    "Mangrove Restoration",
  ]

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.projectName.trim() !== "" && formData.projectType !== ""
      case 2:
        return formData.approximateArea.trim() !== "" && formData.location.trim() !== ""
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Carbon Sequestration Project</CardTitle>
          <CardDescription>
            Help combat climate change by registering your carbon sequestration initiative
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={currentStep >= 1 ? "text-green-600 font-medium" : ""}>Project Info</span>
              <span className={currentStep >= 2 ? "text-green-600 font-medium" : ""}>Details</span>
              <span className={currentStep >= 3 ? "text-green-600 font-medium" : ""}>Review</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Project Information</h3>
                  <p className="text-sm text-muted-foreground">Let's start with the basic details of your project</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      placeholder="Enter your project name (e.g., Downtown Community Garden)"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange("projectName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange("projectType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPublic">Project Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your project visible to the public community
                        </p>
                      </div>
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground pl-0">
                      {formData.isPublic ? (
                        <span className="text-green-600">
                          ✓ Public - Your project will be visible to others and contribute to community impact metrics
                        </span>
                      ) : (
                        <span className="text-orange-600">⚬ Private - Your project will only be visible to you</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Project Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide specific details about your project's scope and location
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="approximateArea">Approximate Area (sq meters) *</Label>
                    <Input
                      id="approximateArea"
                      type="number"
                      placeholder="Enter area in square meters (e.g., 1500)"
                      value={formData.approximateArea}
                      onChange={(e) => handleInputChange("approximateArea", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Tip: 1 acre ≈ 4,047 square meters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Enter project location (e.g., Central Park, New York, NY)"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include city, state/province, and country for better identification
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">Review Your Project</h3>
                  <p className="text-sm text-muted-foreground">Please review the information before submitting</p>
                </div>

                <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Project Name</Label>
                      <p className="font-medium">{formData.projectName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Project Type</Label>
                      <p className="font-medium">{formData.projectType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Area</Label>
                      <p className="font-medium">{formData.approximateArea} sq meters</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="font-medium">{formData.location}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">Visibility</Label>
                      <p className="font-medium flex items-center space-x-2">
                        <span>{formData.isPublic ? "Public Project" : "Private Project"}</span>
                        {formData.isPublic ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Community Visible
                          </span>
                        ) : (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                            Personal Only
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Environmental Impact</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your {formData.projectType?.toLowerCase()} project will contribute to carbon sequestration and
                        help combat climate change. Thank you for making a difference!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()} className="flex items-center space-x-2">
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isStepValid()} className="bg-green-600 hover:bg-green-700">
                Create Project
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}