"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MinusCircle } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface MaxCount {
  adult: number
  teen: number
  child: number
}

interface BenefitOption {
  optionName: string
  benefit: string
  basePriceAdult: number
  basePriceTeen: number
  basePriceChild: number
  discountPercentAdult: number
  discountPercentTeen: number
  discountPercentChild: number
  detailText: string
  maxCount: MaxCount
}

interface BenefitData {
  cardName: string
  category: string
  description: string
  options: BenefitOption[]
}

interface BenefitOptionsFormProps {
  data: BenefitData
  setData: (data: BenefitData) => void
}

export default function BenefitOptionsForm({
  data,
  setData,
}: BenefitOptionsFormProps) {
  const handleOptionChange = (
    index: number,
    field: keyof BenefitOption,
    value: string | number
  ) => {
    const updatedOptions = [...data.options]
    const option = { ...updatedOptions[index] }
    ;(option[field] as any) = value
    updatedOptions[index] = option
    setData({ ...data, options: updatedOptions })
  }

  const handleMaxCountChange = (
    index: number,
    field: keyof MaxCount,
    value: number
  ) => {
    const updatedOptions = [...data.options]
    updatedOptions[index].maxCount[field] = value
    setData({ ...data, options: updatedOptions })
  }

  const addOption = () => {
    const newOption: BenefitOption = {
      optionName: "",
      benefit: "",
      basePriceAdult: 0,
      basePriceTeen: 0,
      basePriceChild: 0,
      discountPercentAdult: 0,
      discountPercentTeen: 0,
      discountPercentChild: 0,
      detailText: "",
      maxCount: { adult: 0, teen: 0, child: 0 },
    }
    setData({ ...data, options: [...data.options, newOption] })
  }

  const removeOption = (index: number) => {
    const updatedOptions = [...data.options]
    updatedOptions.splice(index, 1)
    setData({ ...data, options: updatedOptions })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>카드 이름</Label>
          <Input
            value={data.cardName}
            onChange={(e) => setData({ ...data, cardName: e.target.value })}
            placeholder="카드 이름을 입력하세요"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>혜택 카테고리</Label>
          <Select
            value={data.category}
            onValueChange={(value) => setData({ ...data, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="제휴카드">제휴카드</SelectItem>
              <SelectItem value="이달의 혜택">이달의 혜택</SelectItem>
              <SelectItem value="포인트">포인트</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>카드 혜택 설명</Label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="혜택 설명을 입력하세요"
            required
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">혜택 옵션</h3>
        <Button type="button" onClick={addOption}>
          + 옵션 추가
        </Button>
      </div>

      {data.options.map((option, index) => (
        <div key={index} className="border p-4 rounded-md space-y-4 bg-muted">
          <div className="flex justify-between items-center">
            <Label className="text-base">옵션 {index + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOption(index)}
            >
              <MinusCircle className="w-5 h-5 text-destructive" />
            </Button>
          </div>

          <div className="grid gap-2">
            <Label>옵션명</Label>
            <Input
              value={option.optionName}
              onChange={(e) =>
                handleOptionChange(index, "optionName", e.target.value)
              }
              placeholder="티켓 옵션명을 입력하세요"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>혜택 설명</Label>
            <Input
              value={option.benefit}
              onChange={(e) =>
                handleOptionChange(index, "benefit", e.target.value)
              }
              placeholder="혜택을 입력하세요"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>어른 가격</Label>
              <Input
                type="number"
                className="appearance-none"
                value={option.basePriceAdult}
                onChange={(e) =>
                  handleOptionChange(index, "basePriceAdult", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label>청소년 가격</Label>
              <Input
                type="number"
                className="appearance-none"
                value={option.basePriceTeen}
                onChange={(e) =>
                  handleOptionChange(index, "basePriceTeen", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label>어린이 가격</Label>
              <Input
                type="number"
                className="appearance-none"
                value={option.basePriceChild}
                onChange={(e) =>
                  handleOptionChange(index, "basePriceChild", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>어른 할인율 (%)</Label>
              <Input
                type="number"
                className="appearance-none"
                value={option.discountPercentAdult}
                onChange={(e) =>
                  handleOptionChange(index, "discountPercentAdult", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label>청소년 할인율 (%)</Label>
              <Input
                type="number"
                className="appearance-none"
                value={option.discountPercentTeen}
                onChange={(e) =>
                  handleOptionChange(index, "discountPercentTeen", Number(e.target.value))
                }
              />
            </div>
            <div>
              <Label>어린이 할인율 (%)</Label>
              <Input
                type="number"
                className="appearance-none"
                value={option.discountPercentChild}
                onChange={(e) =>
                  handleOptionChange(index, "discountPercentChild", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>상세 설명</Label>
            <Textarea
              value={option.detailText}
              onChange={(e) =>
                handleOptionChange(index, "detailText", e.target.value)
              }
              placeholder="옵션 상세 설명 입력하세요"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>인원 수 제한</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                className="appearance-none"
                value={option.maxCount.adult}
                onChange={(e) =>
                  handleMaxCountChange(index, "adult", Number(e.target.value))
                }
                placeholder="성인"
              />
              <Input
                type="number"
                className="appearance-none"
                value={option.maxCount.teen}
                onChange={(e) =>
                  handleMaxCountChange(index, "teen", Number(e.target.value))
                }
                placeholder="청소년"
              />
              <Input
                type="number"
                className="appearance-none"
                value={option.maxCount.child}
                onChange={(e) =>
                  handleMaxCountChange(index, "child", Number(e.target.value))
                }
                placeholder="어린이"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}