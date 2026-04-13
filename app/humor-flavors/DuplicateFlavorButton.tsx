"use client"
import { createSupabaseBrowserClient } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DuplicateFlavorButtonProps {
  flavorId: number
  flavorName: string
  flavorDescription: string | null
}

export default function DuplicateFlavorButton({ 
  flavorId, 
  flavorName, 
  flavorDescription 
}: DuplicateFlavorButtonProps) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState(`${flavorName} (Copy)`)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDuplicate = async () => {
    if (!newName.trim()) {
      setError("Please enter a name for the duplicated flavor")
      return
    }

    setIsDuplicating(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        throw new Error("Not authenticated")
      }

      // Step 1: Create the new flavor
      const { data: newFlavor, error: flavorError } = await supabase
        .from('humor_flavors')
        .insert({
          name: newName.trim(),
          description: flavorDescription,
          created_by_user_id: session.user.id,
          modified_by_user_id: session.user.id,
          created_datetime_utc: new Date().toISOString(),
          modified_datetime_utc: new Date().toISOString()
        })
        .select()
        .single()

      if (flavorError) throw flavorError

      // Step 2: Get all steps from the original flavor
      const { data: originalSteps, error: stepsError } = await supabase
        .from('humor_flavor_steps')
        .select('*')
        .eq('humor_flavor_id', flavorId)
        .order('order_by', { ascending: true })

      if (stepsError) throw stepsError

      // Step 3: Duplicate all steps with the new flavor ID
      if (originalSteps && originalSteps.length > 0) {
        const newSteps = originalSteps.map(step => ({
          humor_flavor_id: newFlavor.id,
          order_by: step.order_by,
          llm_temperature: step.llm_temperature,
          llm_input_type_id: step.llm_input_type_id,
          llm_output_type_id: step.llm_output_type_id,
          llm_model_id: step.llm_model_id,
          humor_flavor_step_type_id: step.humor_flavor_step_type_id,
          llm_system_prompt: step.llm_system_prompt,
          llm_user_prompt: step.llm_user_prompt,
          description: step.description,
          created_by_user_id: session.user.id,
          modified_by_user_id: session.user.id,
          created_datetime_utc: new Date().toISOString(),
          modified_datetime_utc: new Date().toISOString()
        }))

        const { error: insertStepsError } = await supabase
          .from('humor_flavor_steps')
          .insert(newSteps)

        if (insertStepsError) throw insertStepsError
      }

      // Success!
      setIsOpen(false)
      router.refresh()
      alert(`Successfully duplicated "${flavorName}" as "${newName}" with ${originalSteps?.length || 0} steps!`)

    } catch (err: any) {
      console.error("Duplication error:", err)
      setError(err.message || "Failed to duplicate flavor")
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition"
      >
        📋 Duplicate
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Duplicate Flavor</h2>
            
            <p className="text-gray-400 mb-4">
              Duplicating: <span className="text-white font-semibold">{flavorName}</span>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Flavor Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter new flavor name"
                disabled={isDuplicating}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isDuplicating ? "Duplicating..." : "Duplicate Flavor"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDuplicating}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}