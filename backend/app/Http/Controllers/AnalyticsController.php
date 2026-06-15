<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __construct(private AnalyticsService $service) {}

    public function dashboard(): JsonResponse
    {
        return response()->json($this->service->getDashboardStats(auth()->user()));
    }

    public function monthlyTrend(Request $request): JsonResponse
    {
        $months = (int) $request->get('months', 12);

        return response()->json($this->service->getMonthlyTrend(auth()->user(), $months));
    }

    public function categoryBreakdown(Request $request): JsonResponse
    {
        $type = $request->get('type', 'expense');

        return response()->json(
            $this->service->getCategoryBreakdown(auth()->user(), $type)
        );
    }

    public function spendingPatterns(): JsonResponse
    {
        return response()->json($this->service->getSpendingPatterns(auth()->user()));
    }

    public function comparison(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_date' => ['required', 'date_format:Y-m-d'],
            'to_date' => ['required', 'date_format:Y-m-d', 'after:from_date'],
        ]);

        return response()->json(
            $this->service->getComparisonStats(
                auth()->user(),
                \Carbon\Carbon::parse($validated['from_date']),
                \Carbon\Carbon::parse($validated['to_date'])
            )
        );
    }
}
