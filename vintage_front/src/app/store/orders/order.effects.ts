import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, catchError, switchMap, tap } from "rxjs/operators"
import { OrderService } from "../../services/order.service"
import { OrderActions } from "./order.actions"
import { Router } from "@angular/router"

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private router: Router,
  ) {}

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      switchMap(() =>
        this.orderService.getAllOrders().pipe(
          map((orders) => OrderActions.loadOrdersSuccess({ orders })),
          catchError((error) => of(OrderActions.loadOrdersFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadOrdersByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrdersByStatus),
      switchMap(({ status }) =>
        this.orderService.getOrdersByStatus(status).pipe(
          map((orders) => OrderActions.loadOrdersByStatusSuccess({ orders })),
          catchError((error) => of(OrderActions.loadOrdersByStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadOrdersByClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrdersByClient),
      switchMap(({ clientId }) =>
        this.orderService.getOrdersByClient(clientId).pipe(
          map((orders) => OrderActions.loadOrdersByClientSuccess({ orders })),
          catchError((error) => of(OrderActions.loadOrdersByClientFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  getOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.getOrder),
      switchMap(({ id }) =>
        this.orderService.getOrderById(id).pipe(
          map((order) => OrderActions.getOrderSuccess({ order })),
          catchError((error) => of(OrderActions.getOrderFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrderStatus),
      switchMap(({ id, status }) =>
        this.orderService.updateOrderStatus(id, status).pipe(
          map((order) => OrderActions.updateOrderStatusSuccess({ order })),
          catchError((error) => of(OrderActions.updateOrderStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.deleteOrder),
      switchMap(({ id }) =>
        this.orderService.deleteOrder(id).pipe(
          map(() => OrderActions.deleteOrderSuccess({ id })),
          catchError((error) => of(OrderActions.deleteOrderFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  // Navigate to orders list after successful deletion
  deleteOrderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrderActions.deleteOrderSuccess),
        tap(() => {
          this.router.navigate(["/admin/orders"])
        }),
      ),
    { dispatch: false },
  )
}

