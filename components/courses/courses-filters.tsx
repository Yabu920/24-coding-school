'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

const categories = [
  { id: 'kids', label: 'Kids Programming', count: 3 },
  { id: 'web', label: 'Web Development', count: 5 },
  { id: 'programming', label: 'Programming Languages', count: 8 },
  { id: 'mobile', label: 'Mobile Development', count: 4 },
  { id: 'data', label: 'Data Science', count: 3 },
]

const levels = [
  { id: 'beginner', label: 'Beginner', count: 12 },
  { id: 'intermediate', label: 'Intermediate', count: 8 },
  { id: 'advanced', label: 'Advanced', count: 5 },
]

const durations = [
  { id: '1-4', label: '1-4 weeks', count: 6 },
  { id: '5-8', label: '5-8 weeks', count: 10 },
  { id: '9-12', label: '9-12 weeks', count: 7 },
  { id: '13+', label: '13+ weeks', count: 4 },
]

export function CoursesFilters() {
  const [priceRange, setPriceRange] = useState([0, 200])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={category.id} />
              <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                {category.label}
              </Label>
              <span className="text-sm text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {levels.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <Checkbox id={level.id} />
              <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                {level.label}
              </Label>
              <span className="text-sm text-muted-foreground">({level.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {durations.map((duration) => (
            <div key={duration.id} className="flex items-center space-x-2">
              <Checkbox id={duration.id} />
              <Label htmlFor={duration.id} className="flex-1 cursor-pointer">
                {duration.label}
              </Label>
              <span className="text-sm text-muted-foreground">({duration.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" variant="outline">
        Clear All Filters
      </Button>
    </div>
  )
}
