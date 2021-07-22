/**
 * Description: Sales flat order payment module service
 */

import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { GetEntityPayload, GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';
import { autobind, Generator } from 'utils/helpers';

import { SalesFlatOrderPaymentModel } from './sales-flat-order-payment.model';
import { SalesFlatOrderPaymentValidator } from './sales-flat-order-payment.validator';
import { PaymentStatus } from './sales-flat-order-payment.enums';
import { ISalesFlatOrderPaymentEntityService, ISalesFlatOrderPaymentRepository } from './interfaces';
import { CreateOrderPaymentPayload, TransactionDataDTO, SalesFlatOrderPaymentModelType } from './types';

@injectable()
export class SalesFlatOrderPaymentService extends BaseService implements ISalesFlatOrderPaymentEntityService {
  constructor(
    @inject(TYPES.ISalesFlatOrderPaymentRepository)
    protected readonly orderPaymentsRepository: ISalesFlatOrderPaymentRepository,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<SalesFlatOrderPaymentModel>> {
    const model = SalesFlatOrderPaymentModel;
    const attributes = this.getModelAttributes<SalesFlatOrderPaymentModelType>({ model });
    const result = await this.orderPaymentsRepository.getOrderPayment({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of order payments
   */
  public async getOrderPayments(query: RequestQueries): Promise<GetListResponse<SalesFlatOrderPaymentModel>> {
    const pagination = this.getPagination({ query });
    const attributes = this.getModelAttributes<SalesFlatOrderPaymentModelType>({
      model: SalesFlatOrderPaymentModel,
    });
    return this.orderPaymentsRepository.getOrderPayments({
      attributes,
      pagination,
    });
  }

  /**
   * Create order payment data
   */
  public async createPaymentData(dto: CreateOrderPaymentPayload): Promise<TransactionDataDTO> {
    const driedValues = this.dryPayload<CreateOrderPaymentPayload>(
      dto,
      this.createOrderPaymentPayloadSchema(),
    );

    SalesFlatOrderPaymentValidator.createOrderPaymentValidator(driedValues);

    const { paymentStatus, ...rest } = driedValues;
    const transactionId = Generator.generateTransactionUuid(driedValues.orderId);
    const transactionData = await this.orderPaymentsRepository.createOrderPayment({
      ...rest,
      status: paymentStatus === PaymentStatus.Succeeded ? 1 : 0,
      transactionId,
    });

    return {
      id: transactionData.id,
      transactionId: transactionData.transactionId,
      status: transactionData.status,
    };
  }

  /**
   * Data transformation schema for order payment creation
   */
  private createOrderPaymentPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      orderId: (value: number) => value,
      referenceId: (value: string) => value,
      reason: (value: string) => value,
      totalPaid: (value: number) => value,
      paymentStatus: (value: number) => value,
    };
  }
}
